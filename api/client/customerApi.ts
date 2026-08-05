import type { APIResponse } from '@playwright/test'

import type { ERPNextApiClient } from './erpnextApiClient'
import type { CreateCustomerRequest } from '../models/customerRequest'

export class CustomerApi {
  private readonly createCustomerEndpoint = '/api/method/frappe.client.save'

  constructor(private readonly apiClient: ERPNextApiClient) {}

  async createCustomer(payload: CreateCustomerRequest): Promise<APIResponse> {
    return this.apiClient.post(this.createCustomerEndpoint, payload)
  }
}
