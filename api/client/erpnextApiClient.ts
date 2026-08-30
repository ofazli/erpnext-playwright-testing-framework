import type { APIRequestContext, APIResponse } from '@playwright/test'

export class ERPNextApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly csrfToken: string
  ) {}

  private jsonHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': this.csrfToken,
    }
  }

  async post<TRequest>(
    endpoint: string,
    payload: TRequest
  ): Promise<APIResponse> {
    return this.request.post(endpoint, {
      data: payload,
      headers: this.jsonHeaders(),
    })
  }

  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(endpoint)
  }

  async put<TRequest>(
    endpoint: string,
    payload: TRequest
  ): Promise<APIResponse> {
    return this.request.put(endpoint, {
      data: payload,
      headers: this.jsonHeaders(),
    })
  }

  async delete<TRequest>(
    endpoint: string,
    payload: TRequest
  ): Promise<APIResponse> {
    return this.request.delete(endpoint, {
      data: payload,
      headers: this.jsonHeaders(),
    })
  }
}
