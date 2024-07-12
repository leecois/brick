import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { handlers, isSecureContext } from '@a/auth'

export const runtime = 'edge'

const AUTH_COOKIE_PATTERN = /authjs\.session-token=(?:[^;]+)/u,
  EXPO_COOKIE_NAME = '__acme-expo-redirect-state',
  /**
   * Noop in production.
   *
   * In development, rewrite the request URL to use localhost instead of host IP address
   * so that Expo Auth works without getting trapped by Next.js CSRF protection.
   * @param req The request to modify
   * @returns The modified request.
   */
  rewriteRequestUrlInDevelopment = (req: NextRequest) => {
    if (isSecureContext) {
      return req
    }

    const host = req.headers.get('host'),
      newURL = new URL(req.url)
    newURL.host = host ?? req.nextUrl.host
    return new NextRequest(newURL, req)
  },
  POST = async (_req: NextRequest) => {
    // First step must be to correct the request URL.
    const req = rewriteRequestUrlInDevelopment(_req)
    return handlers.POST(req)
  },
  GET = async (_req: NextRequest, props: { params: { nextauth: string[] } }) => {
    // First step must be to correct the request URL.
    const req = rewriteRequestUrlInDevelopment(_req),
      [nextauthAction] = props.params.nextauth,
      isExpoSignIn = req.nextUrl.searchParams.get('expo-redirect'),
      isExpoCallback = cookies().get(EXPO_COOKIE_NAME)

    if (nextauthAction === 'signin' && isExpoSignIn) {
      // Set a cookie we can read in the callback
      // To know to send the user back to expo
      cookies().set({
        maxAge: 60 * 10,
        // 10 min
        name: EXPO_COOKIE_NAME,
        path: '/',
        value: isExpoSignIn
      })
    }

    if (nextauthAction === 'callback' && isExpoCallback) {
      cookies().delete(EXPO_COOKIE_NAME)

      // Run original handler, then extract the session token from the response
      // Send it back via a query param in the Expo deep link. The Expo app
      // Will then get that and set it in the session storage.
      const authResponse = await handlers.GET(req),
        setCookie = authResponse.headers
          .getSetCookie()
          .find(cookie => AUTH_COOKIE_PATTERN.test(cookie)),
        match = setCookie?.match(AUTH_COOKIE_PATTERN)?.[1]

      if (!match) {
        throw new Error(
          `Unable to find session cookie: ${JSON.stringify(authResponse.headers.getSetCookie())}`
        )
      }

      const url = new URL(isExpoCallback.value)
      url.searchParams.set('session_token', match)
      return NextResponse.redirect(url)
    }

    // Every other request just calls the default handler
    return handlers.GET(req)
  }

export { GET, POST }
