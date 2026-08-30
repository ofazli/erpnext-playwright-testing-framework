import { test as base, expect, type APIRequestContext } from '@playwright/test'

import { ERPNextApiClient } from '../api/client/erpnextApiClient'
import { CustomerApi } from '../api/client/customerApi'
import { NewBankApi } from '../api/client/newBankApi'
import { fetchCsrfToken } from '../api/utils/csrfToken'

type ApiFixtures = {
  authenticatedRequest: APIRequestContext
  csrfToken: string
  erpnextApiClient: ERPNextApiClient
  customerApi: CustomerApi
  bankApi: NewBankApi
}

export const test = base.extend<ApiFixtures>({
  authenticatedRequest: async ({ playwright }, use) => {
    const baseURL = process.env.BASE_URL
    const username = process.env.ADMIN_USERNAME
    const password = process.env.ADMIN_PASSWORD

    if (!baseURL) {
      throw new Error('BASE_URL environment variable is missing.')
    }

    if (!username) {
      throw new Error('ADMIN_USERNAME environment variable is missing.')
    }

    if (!password) {
      throw new Error('ADMIN_PASSWORD environment variable is missing.')
    }

    const request = await playwright.request.newContext({
      baseURL,
    })

    const loginResponse = await request.post('/api/method/login', {
      form: {
        usr: username,
        pwd: password,
      },
    })

    if (!loginResponse.ok()) {
      const responseBody = await loginResponse.text()

      await request.dispose()

      throw new Error(
        `API login failed with status ${loginResponse.status()} and body ${responseBody}`
      )
    }

    const loginResponseBody = await loginResponse.json()

    if (loginResponseBody.message !== 'Logged In') {
      await request.dispose()

      throw new Error(
        `API login response was unexpected: ${JSON.stringify(loginResponseBody)}`
      )
    }

    await use(request)

    await request.dispose()
  },

  csrfToken: async ({ authenticatedRequest }, use) => {
    await use(await fetchCsrfToken(authenticatedRequest))
  },

  erpnextApiClient: async ({ authenticatedRequest, csrfToken }, use) => {
    await use(new ERPNextApiClient(authenticatedRequest, csrfToken))
  },

  customerApi: async ({ erpnextApiClient }, use) => {
    await use(new CustomerApi(erpnextApiClient))
  },

  bankApi: async ({ erpnextApiClient }, use) => {
    await use(new NewBankApi(erpnextApiClient))
  },
})

export { expect }
