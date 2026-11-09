import {
  test,
  expect,
  payload,
  json,
  create,
  stableFields,
  assertOrderSchema,
} from './fixtures.mjs';

// Synthetic requirements lab-v1, OpenAPI 3.0.3; mapping.json records each clause.
test('[ZEP-101] R1 R3 create and persistence', async ({ api }) => {
  const id = api.reserve();
  const expected = { id, quantity: 2, unitPriceCents: 125, totalCents: 250, owner: 'alice' };
  const created = await json(await api.alice.post('/orders', { data: payload(id) }), 201);
  assertOrderSchema(created);
  expect(stableFields(created)).toEqual(expected);

  const persisted = await json(await api.alice.get(`/orders/${id}`), 200);
  assertOrderSchema(persisted);
  expect(stableFields(persisted)).toEqual(expected);
});

test('[ZEP-102] R2 foreign access preserves business state', async ({ api }) => {
  const id = api.reserve();
  const before = await create(api.alice, id);
  await json(await api.bob.get(`/orders/${id}`), 404);
  await json(await api.bob.delete(`/orders/${id}`), 404);
  const after = await json(await api.alice.get(`/orders/${id}`), 200);
  assertOrderSchema(after);
  expect(stableFields(after)).toEqual(before);
});

test('[ZEP-103] R1 R6 invalid quantity has no effects', async ({ api }) => {
  for (const quantity of [0, 11]) {
    const id = api.reserve();
    await json(await api.alice.post('/orders', { data: payload(id, { quantity }) }), 422);
    await json(await api.alice.get(`/orders/${id}`), 404);
  }
});

test('[ZEP-104] R2 anonymous create denied', async ({ api }) => {
  const id = api.reserve();
  await json(await api.anonymous.post('/orders', { data: payload(id) }), 401);
  await json(await api.alice.get(`/orders/${id}`), 404);
});

test('[ZEP-105] R4 remove owned resource', async ({ api }) => {
  const id = api.reserve();
  await create(api.alice, id);
  const deleted = await api.alice.delete(`/orders/${id}`);
  expect(deleted.status()).toBe(204);
  expect(await deleted.body()).toHaveLength(0); // R4: bodyless success, not JSON
  await json(await api.alice.get(`/orders/${id}`), 404);
  await json(await api.alice.delete(`/orders/${id}`), 404);
});

test('[ZEP-106] R5 duplicate preserves documented fields', async ({ api }) => {
  const id = api.reserve();
  const before = await create(api.alice, id);
  for (const caller of [api.alice, api.bob]) {
    await json(await caller.post('/orders', { data: payload(id, { quantity: 3 }) }), 409);
  }
  const after = await json(await api.alice.get(`/orders/${id}`), 200);
  assertOrderSchema(after);
  expect(stableFields(after)).toEqual(before);
});

test('[ZEP-107] R1 accepted quantity boundaries', async ({ api }) => {
  for (const [quantity, expectedTotal] of [
    [1, 125],
    [10, 1250],
  ]) {
    await create(api.alice, api.reserve(), quantity, expectedTotal);
  }
});

// Supplemental contract probes, not additional approved Zephyr cases.
test('R1 R6 invalid price has no effects', async ({ api }) => {
  for (const unitPriceCents of [0, 10001]) {
    const id = api.reserve();
    await json(await api.alice.post('/orders', { data: payload(id, { unitPriceCents }) }), 422);
    await json(await api.alice.get(`/orders/${id}`), 404);
  }
});

test('R3 lists only caller-owned orders', async ({ api }) => {
  const id = api.reserve();
  await create(api.alice, id);
  const list = await json(await api.bob.get('/orders'), 200);
  expect(Array.isArray(list.orders)).toBe(true);
  expect(list.orders.some((order) => order.id === id)).toBe(false);
  for (const order of list.orders) {
    assertOrderSchema(order);
    expect(order.owner).toBe('bob');
  }
});
