export type CustomerType = 'Company' | 'Individual' | 'Partnership'

export interface CustomerRequest {
  doctype: 'Customer'
  customer_name: string
  customer_type: CustomerType
  customer_group: string
  territory: string
  email_id?: string
  mobile_no?: string
}

export interface CreateCustomerRequest {
  doc: CustomerRequest
}
