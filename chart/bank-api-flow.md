# Yeni Banka API Flow Chart

```mermaid
flowchart TD
    START(["Test başlar"])
    T["Playwright testi<br/>createABank.spec.ts"]
    B["buildBank()<br/>Benzersiz banka payload'u oluştur"]
    F["API fixture<br/>Giriş yap ve CSRF token al"]
    A["NewBankApi.createBank()"]
    C["ERPNextApiClient.post()"]
    E["POST /api/method/frappe.client.save"]
    D["ERPNext Bank DocType<br/>Banka kaydını oluştur"]
    R["CreateBankResponse"]
    V{"Yanıt geçerli mi?"}
    P["Banka oluşturuldu<br/>Test başarılı"]
    X["Test başarısız"]
    END(["Test biter"])

    START --> T
    T --> B
    T --> F
    B -->|"doc: BankRequest"| A
    F -->|"Kimliği doğrulanmış istek"| A
    A --> C
    C -->|"JSON + X-Frappe-CSRF-Token"| E
    E --> D
    D -->|"message: BankResponseData"| R
    R --> V
    V -->|"Evet: 200 + eşleşen alanlar"| P
    V -->|"Hayır: hatalı durum veya veri"| X
    P --> END
    X --> END
```

## Request payload

```json
{
  "doc": {
    "doctype": "Bank",
    "bank_name": "Automation Bank 1234567890",
    "swift_number": "AUTOCA67890"
  }
}
```

## Main files

| Layer | File | Responsibility |
| --- | --- | --- |
| Test | `tests/api/payments/bank/createABank.spec.ts` | Sends the request and verifies the response |
| Builder | `api/builders/bankBuilder.ts` | Creates a unique bank payload |
| Model | `api/models/bankRequest.ts` | Defines the request contract |
| API service | `api/client/newBankApi.ts` | Defines the ERPNext endpoint |
| HTTP client | `api/client/erpnextApiClient.ts` | Sends the authenticated POST request |
| Fixture | `fixtures/api.ts` | Provides login, CSRF token, and `bankApi` |
