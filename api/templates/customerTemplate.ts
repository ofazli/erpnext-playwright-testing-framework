//this is a payload of customer creation
import type { CustomerRequest } from '../models/customerRequest'

export const customerTemplate: CustomerRequest = {
  doctype: 'Customer',
  customer_name: 'Test Customer',
  customer_type: 'Company',
  customer_group: 'Commercial',
  territory: 'All Territories',
  email_id: 'test@example.com',
  mobile_no: '1234567890',
}
