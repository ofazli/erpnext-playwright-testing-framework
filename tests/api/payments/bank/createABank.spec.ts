import { buildBank } from '../../../../api/builders/bankBuilder'
import type { CreateBankResponse } from '../../../../api/models/bankResponse'
import { test, expect } from '../../../../fixtures/api'

test.describe('Bank API', () => {
  test('Should create a new bank successfully', async ({ bankApi }) => {
    const bankPayload = buildBank()

    const response = await bankApi.createBank(bankPayload)

    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

    const responseBody = (await response.json()) as CreateBankResponse

    expect(responseBody.message).toBeDefined()
    expect(responseBody.message.doctype).toBe('Bank')
    expect(responseBody.message.bank_name).toBe(bankPayload.doc.bank_name)
    expect(responseBody.message.swift_number).toBe(bankPayload.doc.swift_number)
  })
})
