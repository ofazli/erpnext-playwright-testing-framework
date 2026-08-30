export interface BankResponseData {
  name: string
  owner: string
  modified_by: string
  bank_name: string
  swift_number: string
  creation: string
  modified: string
  doctype: 'Bank'
}

export interface CreateBankResponse {
  message: BankResponseData
}
