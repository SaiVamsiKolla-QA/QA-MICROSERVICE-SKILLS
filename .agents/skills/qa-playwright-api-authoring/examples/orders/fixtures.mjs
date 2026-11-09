import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

import { payload, stableFields } from './data.mjs';
export { payload, stableFields };

/** @typedef {import('@playwright/test').APIRequestContext} APIRequestContext */
/** @typedef {import('./data.mjs').Order} Order */
/** @typedef {{alice: APIRequestContext, bob: APIRequestContext, anonymous: APIRequestContext, reserve: (owner?: APIRequestContext) => string}} ApiClients */
/** @typedef {import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions} TestArgs */
/** @typedef {import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions} WorkerArgs */

/**
 * Validate raw required fields before comparing stable business state.
 * The lab permits additional response properties, including changing metadata.
 * @param {unknown} body
 * @returns {asserts body is Order}
 */
export function assertOrderSchema(body) {
  expect(body).not.toBeNull();
  expect(typeof body).toBe('object');
  expect(Array.isArray(body)).toBe(false);
  // Object assertions above justify inspecting its fields; no parsing/coercion hides extras.
  const fields = /** @type {Record<string, unknown>} */ (body);
  expect(fields.id).toEqual(expect.any(String));
  for (const field of ['quantity', 'unitPriceCents', 'totalCents']) {
    expect(Number.isInteger(fields[field]), `required integer ${field}`).toBe(true);
  }
  expect(['alice', 'bob'], 'required owner').toContain(fields.owner);
}

/** @type {import('@playwright/test').Fixtures<{api: ApiClients}, {}, TestArgs, WorkerArgs>} */
const apiFixtures = {
  api: async ({ playwright, baseURL }, use, testInfo) => {
    /** @type {APIRequestContext[]} */
    const contexts = [];
    /** @type {{id: string, owner: APIRequestContext}[]} */
    const owned = [];
    /** @type {Error[]} */
    const errors = [];
    /** @type {{id: string, operation: string, status: number}[]} */
    const attempts = [];
    /** @param {string} [user] */
    const client = async (user) => {
      const context = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: user ? { Authorization: `Bearer ${user}` } : {},
      });
      contexts.push(context);
      return context;
    };
    try {
      // Setup is inside try: even partial context setup is disposed.
      const alice = await client('alice');
      const bob = await client('bob');
      const anonymous = await client();
      await use({
        alice,
        bob,
        anonymous,
        reserve: (owner = alice) => {
          const id = `qa-w${testInfo.workerIndex}-p${testInfo.parallelIndex}-r${testInfo.repeatEachIndex}-t${testInfo.retry}-${randomUUID()}`;
          owned.push({ id, owner }); // before POST, including rejected-create probes
          return id;
        },
      });
    } finally {
      for (const { id, owner } of owned) {
        for (const operation of /** @type {const} */ (['delete', 'get'])) {
          try {
            const response = await owner[operation](`/orders/${encodeURIComponent(id)}`);
            attempts.push({ id, operation, status: response.status() });
            if (operation === 'delete') expect([204, 404]).toContain(response.status());
            else expect(response.status()).toBe(404);
          } catch (cause) {
            const message = cause instanceof Error ? cause.message : String(cause);
            errors.push(new Error(`cleanup ${operation} ${id}: ${message}`, { cause }));
          }
        }
      }
      for (const context of contexts) {
        try {
          await context.dispose();
        } catch (cause) {
          errors.push(new Error('dispose request context', { cause }));
        }
      }
      try {
        await testInfo.attach('owned-resource-cleanup', {
          body: Buffer.from(JSON.stringify({ attempts, errors: errors.map((e) => e.message) })),
          contentType: 'application/json',
        });
      } catch (cause) {
        errors.push(new Error('attach cleanup evidence', { cause }));
      }
      // Playwright reports this teardown error alongside any test-body error.
      if (errors.length) {
        // eslint-disable-next-line no-unsafe-finally -- Playwright retains the body error; this adds aggregate teardown evidence.
        throw new AggregateError(errors, errors.map((e) => e.message).join('\n'));
      }
    }
  },
};
export const test = base.extend(apiFixtures);

/**
 * Only for lab endpoints with a documented JSON body; 204 is checked directly.
 * @param {import('@playwright/test').APIResponse} response
 * @param {number} status
 * @returns {Promise<unknown>}
 */
export async function json(response, status) {
  expect(response.status()).toBe(status);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  if (status >= 400) expect(body).toMatchObject({ error: expect.any(String) });
  return body;
}

/**
 * R1/R3: expected totals come from reviewed examples, not the service.
 * @param {APIRequestContext} api
 * @param {string} id
 * @param {number} [quantity]
 * @param {number} [total]
 * @returns {Promise<Order>}
 */
export async function create(api, id, quantity = 2, total = 250) {
  /** @type {Order} */
  const expected = { id, quantity, unitPriceCents: 125, totalCents: total, owner: 'alice' };
  const created = await json(await api.post('/orders', { data: payload(id, { quantity }) }), 201);
  assertOrderSchema(created);
  expect(stableFields(created)).toEqual(expected);
  const read = await json(await api.get(`/orders/${id}`), 200);
  assertOrderSchema(read);
  expect(stableFields(read)).toEqual(expected);
  return stableFields(read);
}

export { expect };
