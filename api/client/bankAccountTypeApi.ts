import type { APIResponse } from '@playwright/test'

import type { ERPNextApiClient } from './erpnextApiClient'
import type {
  CreateBankAccountTypeRequest,
  DeleteBankAccountTypeRequest,
} from '../models/bankAccountTypeRequest'

export class BankAccountTypeApi {
  private readonly createBankAccountTypeEndpoint =
    '/api/method/frappe.desk.form.save.savedocs'
  private readonly deleteBankAccountTypeEndpoint =
    '/api/method/frappe.client.delete'

  constructor(private readonly apiClient: ERPNextApiClient) {}

  async createBankAccountType(
    payload: CreateBankAccountTypeRequest,
  ): Promise<APIResponse> {
    return this.apiClient.post(this.createBankAccountTypeEndpoint, payload)
  }

  async deleteBankAccountType(
    payload: DeleteBankAccountTypeRequest,
  ): Promise<APIResponse> {
    return this.apiClient.delete(this.deleteBankAccountTypeEndpoint, payload)
  }
}
