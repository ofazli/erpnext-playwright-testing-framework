import type { Customer } from '../models/Customer'
import { defaultCompanyCustomer } from '../test-data/customersDefaults'

type CustomerOverides = Partial<Customer>

export class CustomerFactory {
  static create(overrides: CustomerOverides = {}): Customer {
    const uniqueId = Date.now()
    return {
      ...defaultCompanyCustomer,
      customerName: `Automation Company ${uniqueId}`,
      emailId: `automation${uniqueId}@example.com`,
      ...overrides,
    }
  }
}
