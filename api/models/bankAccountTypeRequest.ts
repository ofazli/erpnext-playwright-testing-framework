export interface BankAccountTypeRequest {
  docstatus: 0
  doctype: 'Bank Account Type'
  name: string
  __islocal: 1
  account_type: string
}

export interface CreateBankAccountTypeRequest {
  doc: BankAccountTypeRequest
  action: 'Save'
}

