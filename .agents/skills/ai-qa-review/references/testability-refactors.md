# Testability changes need an observed problem

Locally adapted from the upstream reference recorded in ../SOURCE.json. Direct construction, I/O in a handler, a broad client object or a class is not itself a defect. Cite a concrete obstacle: an important rule cannot be tested independently, tests contact an unrelated service, or repeated setup obscures diagnosis.

Try existing seams first. A function argument or current fixture may suffice; do not introduce interface hierarchies, dependency containers, base classes or universal pure-function rules. Propose application changes only within the authorized review scope.

## Example: testing a rule currently requires unrelated I/O

If every total calculation test must create database state and send email, extraction may enable focused unit checks:

```js
// Only when the documented rule is this sum in integer cents.
export function totalCents(items) {
  return items.reduce((total, item) => total + item.quantity * item.unitPriceCents, 0);
}
```

Keep persistence/notifications in the checkout path and retain integration assertions for their effects. Derive independent golden test expectations from requirements, not this implementation function. Do not extract when the existing test seam already exercises the rule clearly.

## Example: unit tests send real external messages

Pass the existing sender function through the smallest supported seam, following project conventions. Add a narrow interface only if a real caller/test-double obstacle warrants one; a large database client does not automatically require wrapping.

Verify before/after with the same business inputs and relevant failing controls. Explain the observed diagnostic or extension benefit. Use parameterization supported by the actual runner; no Jest API is assumed for Playwright.
