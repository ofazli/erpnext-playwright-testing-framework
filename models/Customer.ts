export type CustomerType = 'Company' | 'Individual' | 'Partnership'
export interface Customer {
  customerName: string
  customerType: CustomerType
  firstName: string
  emailId: string
  lastName: string
  mobileNumber: number
  addressLine1: string
  addressLine2?: string
  zipCode: string
  city: string
  state: string
  country: string
}
