import { buildBank } from '../../../../api/builders/bankBuilder'
import type { CreateBankResponse } from '../../../../api/models/bankResponse'
import { test, expect } from '../../../../fixtures/api'

test.describe('Bank API', () => {
  test('Should delete a bank successfully', async ({ bankApi }) => {
    const bankPayload = buildBank()
    const createResponse = await bankApi.createBank(bankPayload)

    expect(createResponse.status()).toBe(200)
    expect(createResponse.ok()).toBeTruthy()

    const createResponseBody =
      (await createResponse.json()) as CreateBankResponse
    const bankName = createResponseBody.message.name

    const deleteResponse = await bankApi.deleteBank({
      doctype: 'Bank',
      name: bankName,
    })

    expect(deleteResponse.status()).toBe(200)
    expect(deleteResponse.ok()).toBeTruthy()

    const getResponse = await bankApi.getBank(bankName)

    expect(getResponse.status()).toBe(404)
  })
})
