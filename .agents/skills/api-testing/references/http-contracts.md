# HTTP response, redirect and cookie contracts

Load when authoring/reviewing body handling, redirect assertions or cookie authentication. Contract requirements remain the oracle; do not add endpoints to a service that lacks them.

## Bodies follow the contract

A success response need not contain JSON. For documented bodyless responses such as 204, assert status and absence; do not call json() or demand application/json. For JSON responses, validate required schema/types and additional-property policy before comparing all stable business fields. Keep the installed schema validator/dialect; these patterns do not justify replacing it.

```js
// Orders lab R4: DELETE returns 204. Independent read verifies the business effect.
const deleted = await api.alice.delete(`/orders/${id}`);
expect(deleted.status()).toBe(204);
expect(await deleted.body()).toHaveLength(0);
const absent = await api.alice.get(`/orders/${id}`);
expect(absent.status()).toBe(404);
```

A non-JSON body is not automatically a service defect; check the declared media type/status first. json() throws on a body that cannot be parsed as JSON. Do not catch parsing errors and return an empty object that hides the real failure.

## Redirects are testable without a browser

Playwright API requests follow redirects by default (limit 20). To assert an initial redirect, use maxRedirects: 0 and check its documented status and Location. A followed final response cannot prove the initial status. Do not accept any 2xx/3xx when a precise outcome is specified. A browser is needed when navigation/rendering itself is the requirement.

```js
// Illustrative only: use the actual service's redirect contract and route.
const response = await request.get('/legacy-orders', { maxRedirects: 0 });
expect(response.status()).toBe(302); // only if contract requires 302
expect(response.headers().location).toBe('/orders');
```

## Cookie isolation is explicit

Standalone apiRequest.newContext() has its own cookie jar; browserContext.request and page.request share the browser context's jar. Request methods send matching cookies and store response cookies. The request fixture can also be initialized through configured storageState/headers: inspect inherited configuration before calling it anonymous.

HttpOnly cookies do not force browser automation for HTTP/session assertions. Inspect cookie attributes through storageState() and verify authenticated effects through requests. Browser JavaScript access/navigation/security behavior needs its own browser evidence. Never share cookie jars or storageState between principals accidentally; keep credentials and cookie values out of reports.

Official checks: [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-get), [request options and storageState](https://playwright.dev/docs/api/class-apirequest#api-request-new-context), [APIResponse.json](https://playwright.dev/docs/api/class-apiresponse#api-response-json). Verified against installed Playwright 1.65.0 with separate loopback mechanics probes; these probes do not define Orders business requirements.

## Corrections to the selected upstream guidance

Currents testing-patterns/api-testing.md excludes redirects/HttpOnly cookies from API testing, says every response needs body assertions and suggests partial matching without full contract-policy validation. The distinctions above replace those overbroad rules. Keep genuine product failures: adjust an expectation only with cited requirement/contract evidence, never to turn a failing run green. See currents-source.json and currents-LICENSE.md for pinned attribution; this is a local adaptation, not a new skill.
