import type { APIResponse } from '@playwright/test'
import type {
  CreateBankRequest,
  DeleteBankRequest,
} from '../models/bankRequest'
import type { ERPNextApiClient } from './erpnextApiClient'

export class NewBankApi {
  private readonly createBankEndpoint = '/api/method/frappe.client.save'
  private readonly deleteBankEndpoint = '/api/method/frappe.client.delete'

  constructor(private readonly apiClient: ERPNextApiClient) {}

  async createBank(payload: CreateBankRequest): Promise<APIResponse> {
    return this.apiClient.post(this.createBankEndpoint, payload)
  }

  async deleteBank(payload: DeleteBankRequest): Promise<APIResponse> {
    return this.apiClient.delete(this.deleteBankEndpoint, payload)
  }

  async getBank(bankName: string): Promise<APIResponse> {
    return this.apiClient.get(`/api/resource/Bank/${encodeURIComponent(bankName)}`)
  }
}
