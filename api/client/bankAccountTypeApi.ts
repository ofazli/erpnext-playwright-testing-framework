import type { APIResponse } from '@playwright/test'

import type { ERPNextApiClient } from './erpnextApiClient'
import type { CreateBankAccountTypeRequest } from '../models/bankAccountTypeRequest'

export class BankAccountTypeApi {
  private readonly createBankAccountTypeEndpoint =
    '/api/method/frappe.desk.form.save.savedocs'

  constructor(private readonly apiClient: ERPNextApiClient) {}

  async createBankAccountType(
    payload: CreateBankAccountTypeRequest,
  ): Promise<APIResponse> {
    return this.apiClient.post(this.createBankAccountTypeEndpoint, payload)
  }
}

