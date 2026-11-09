/** @typedef {{id: string, quantity: number, unitPriceCents: number}} OrderInput */
/** @typedef {OrderInput & {totalCents: number, owner: 'alice' | 'bob'}} Order */

/**
 * Fixed business inputs; uniqueness belongs to the fixture-owned ID.
 * @param {string} id
 * @param {Partial<OrderInput>} [overrides]
 * @returns {OrderInput}
 */
export const payload = (id, overrides = {}) => ({
  id,
  quantity: 2,
  unitPriceCents: 125,
  ...overrides,
});

/**
 * All stable fields in lab-v1; raw schema policy is validated separately.
 * @param {Order} body
 * @returns {Order}
 */
export function stableFields(body) {
  const { id, quantity, unitPriceCents, totalCents, owner } = body;
  return { id, quantity, unitPriceCents, totalCents, owner };
}
