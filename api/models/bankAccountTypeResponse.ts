export interface BankAccountTypeResponseData {
  name: string
  doctype: 'Bank Account Type'
  docstatus: number
  account_type: string
  creation?: string
  modified?: string
  owner?: string
  modified_by?: string
}

export interface CreateBankAccountTypeResponse {
  docs: BankAccountTypeResponseData[]
  docinfo?: Record<string, unknown>
}

