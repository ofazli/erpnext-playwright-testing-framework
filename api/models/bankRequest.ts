export interface BankRequest {
  doctype: 'Bank'
  bank_name: string
  swift_number?: string
}

export interface CreateBankRequest {
  doc: BankRequest
}

export interface DeleteBankRequest {
  doctype: 'Bank'
  name: string
}
