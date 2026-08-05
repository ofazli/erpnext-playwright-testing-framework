export interface CustomerResponseData {
  name: string
  doctype: 'Customer'
  customer_name: string
  customer_type: 'Company' | 'Individual' | 'Partnership'
  customer_group?: string
  territort?: string
  disabled?: number
  email_id?: string
  mobile_no?: string
  creation?: string
  modified?: string
  owner?: string
}

export interface CreateCustomerResponse {
  message: CustomerResponseData
}
