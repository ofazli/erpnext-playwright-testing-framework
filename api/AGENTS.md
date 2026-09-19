# API Development Rules

These instructions apply to the ERPNext API implementation and API tests in
this repository.

## Current API architecture

The API flow is:

```text
Playwright API test
  -> API fixture authenticates with /api/method/login
  -> CSRF token is retrieved
  -> Entity builder creates a typed payload
  -> Entity API client selects the ERPNext endpoint
  -> ERPNextApiClient sends JSON with the CSRF header
  -> Test validates status and response.message
```

Current entity implementations:

| Entity | Client | Builder | Request model | Response model |
| --- | --- | --- | --- | --- |
| Customer | `api/client/customerApi.ts` | `api/builders/customerBuilder.ts` | `api/models/customerRequest.ts` | `api/models/customerResponse.ts` |
| Bank | `api/client/newBankApi.ts` | `api/builders/bankBuilder.ts` | `api/models/bankRequest.ts` | `api/models/bankResponse.ts` |
| Bank Account Type | `api/client/bankAccountTypeApi.ts` | `api/builders/bankAccountTypeBuilder.ts` | `api/models/bankAccountTypeRequest.ts` | `api/models/bankAccountTypeResponse.ts` |

## Authentication and request rules

1. Use the shared fixtures from `fixtures/api.ts`.
2. Authenticate with `POST /api/method/login` using `BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
3. Obtain the CSRF token through `api/utils/csrfToken.ts`.
4. Send JSON write requests through `ERPNextApiClient`.
5. Preserve the `Content-Type: application/json` and `X-Frappe-CSRF-Token` headers.
6. Do not create a separate authentication or HTTP transport implementation inside an entity client.

## Entity client rules

- Keep endpoint paths inside the relevant entity API client.
- Use `/api/method/frappe.client.save` for the current Customer and Bank create flows.
- Use `/api/method/frappe.client.delete` for Bank deletion.
- Use `/api/resource/Bank/{encoded-name}` for Bank retrieval and deletion verification.
- Use `/api/method/frappe.desk.form.save.savedocs` for Bank Account Type creation.
- Bank Account Type create payloads must include `action: 'Save'`, `docstatus: 0`, and `__islocal: 1`.
- URL-encode resource names before adding them to a URL.
- Keep entity clients focused on endpoint mapping; keep transport and headers in `ERPNextApiClient`.

## Payload rules

ERPNext create requests must wrap the document in `doc`:

```json
{
  "doc": {
    "doctype": "Customer or Bank",
    "field_name": "value"
  }
}
```

- Keep `doctype` as a literal type in the request model.
- Put reusable defaults in `api/templates/`.
- Put generated or unique values in `api/builders/`.
- Allow safe test-specific field overrides through builder arguments.
- Do not duplicate default payloads inside individual tests.

## Test rules

Every API test should:

1. Build its payload with the relevant builder.
2. Call the entity API client through the API fixture.
3. Assert the expected HTTP status and `response.ok()`.
4. Parse the response using the relevant response model.
5. Validate the returned `message` object and compare important returned fields with the request payload.

For create/delete lifecycle tests, use the name returned by the create response
when deleting or retrieving the record. Do not assume the generated display
name is the ERPNext document name.

## Adding a new ERPNext API entity

When adding a new entity, follow this order:

1. Add a request interface in `api/models/`.
2. Add a response interface in `api/models/`.
3. Add default values in `api/templates/`.
4. Add a unique-data builder in `api/builders/`.
5. Add an entity API client in `api/client/`.
6. Register the client in `fixtures/api.ts`.
7. Add an API test under `tests/api/`.
8. Update `docs/API_ENTITY_CREATION.md`.
9. Update `chart/api-entity-creation-flow.md` if the flow or supported entities change.

## Verification commands

Use the relevant command after making changes:

```bash
npx tsc --noEmit
npx playwright test tests/api/Customer/createCustomer.spec.ts --project=chromium
npx playwright test tests/api/payments/bank/createABank.spec.ts --project=chromium
npx playwright test tests/api/payments/bank/deleteABank.spec.ts --project=chromium
npx playwright test tests/api/payments/bank/BankAccountType/createBankAccountType.spec.ts --project=chromium
```
