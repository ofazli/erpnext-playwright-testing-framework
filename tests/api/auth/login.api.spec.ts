import { test, expect } from '@playwright/test'
import { adminUser } from '../../../test-data/users'

test.describe('EPRNext Login API', () => {
  test('Administrator must login successfully', async ({ request }) => {
    const response = await request.post('/api/method/login', {
      form: {
        usr: adminUser.username,
        pwd: adminUser.password,
      },
    })
    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody.message).toBe('Logged In')
    const fullCookie = response.headers()['set-cookie']
    // get the sid cookie
    const sidCookie = fullCookie.split(';')[0]
    console.log(sidCookie)
  })
})
