import type {
  CreateCustomerRequest,
  CustomerRequest,
} from '../models/customerRequest'
import { customerTemplate } from '../templates/customerTemplate'

type CustomerOverrides = Partial<Omit<CustomerRequest, 'doctype'>>

function createUniqueSuffix(): string {
  return Date.now().toString()
}

export function buildCustomer(
  overrides: CustomerOverrides = {}
): CreateCustomerRequest {
  const uniqueSuffix = createUniqueSuffix()

  return {
    doc: {
      ...customerTemplate,
      customer_name: `Automation Company ${uniqueSuffix}`,
      email_id: `automation-${uniqueSuffix}@test.com`,
      mobile_no: `416${uniqueSuffix.slice(-7).padStart(7, '0')}`,
      ...overrides,
    },
  }
}
