import type {
  BankAccountTypeRequest,
  CreateBankAccountTypeRequest,
} from '../models/bankAccountTypeRequest'
import { bankAccountTypeTemplate } from '../templates/bankAccountTypeTemplate'

type BankAccountTypeOverrides = Partial<
  Omit<BankAccountTypeRequest, 'doctype' | 'docstatus' | '__islocal'>
>

function createUniqueSuffix(): string {
  return Date.now().toString()
}

export function buildBankAccountType(
  overrides: BankAccountTypeOverrides = {},
): CreateBankAccountTypeRequest {
  const uniqueSuffix = createUniqueSuffix()

  return {
    doc: {
      ...bankAccountTypeTemplate,
      name: `new-bank-account-type-${uniqueSuffix}`,
      account_type: `Checking${uniqueSuffix}`,
      ...overrides,
    },
    action: 'Save',
  }
}

