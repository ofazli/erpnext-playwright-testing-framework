import type { APIRequestContext } from '@playwright/test'

function extractCsrfFromHtml(html: string): string | undefined {
  const patterns = [
    /csrf_token\s*=\s*"([^"]+)"/,
    /csrf_token\s*=\s*'([^']+)'/,
    /"csrf_token"\s*:\s*"([^"]+)"/,
    /'csrf_token'\s*:\s*'([^']+)'/,
    /window\.csrf_token\s*=\s*"([^"]+)"/,
    /window\.csrf_token\s*=\s*'([^']+)'/,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return undefined
}

export async function fetchCsrfToken(
  request: APIRequestContext
): Promise<string> {
  const csrfResponse = await request.get(
    '/api/method/frappe.sessions.get_csrf_token'
  )

  if (csrfResponse.ok()) {
    const csrfBody = (await csrfResponse.json()) as { message: string }
    if (csrfBody.message) {
      return csrfBody.message
    }
  }

  const appResponse = await request.get('/')
  if (appResponse.ok()) {
    const html = await appResponse.text()
    const csrfToken = extractCsrfFromHtml(html)
    if (csrfToken) {
      return csrfToken
    }
  }

  throw new Error('Could not obtain CSRF token after login.')
}
