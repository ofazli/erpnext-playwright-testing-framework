import type { CreateBankRequest, BankRequest } from '../models/bankRequest'
import { bankTemplate } from '../templates/bankTemplate'

type BankOverrides = Partial<Omit<BankRequest, 'doctype'>>

function createUniqueSuffix(): string {
  return Date.now().toString()
}

export function buildBank(overrides: BankOverrides = {}): CreateBankRequest {
  const uniqueSuffix = createUniqueSuffix()

  return {
    doc: {
      ...bankTemplate,
      bank_name: `Automation Bank ${uniqueSuffix}`,
      swift_number: `AUTOCA${uniqueSuffix.slice(-5)}`,
      ...overrides,
    },
  }
}
