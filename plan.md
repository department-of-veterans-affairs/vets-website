# Plan: Mock User Sign-In on Vercel

## Problem

The Vercel deployment has no working sign-in flow. While `GET /v0/user` is already mocked
in `api/mock.js` and returns an authenticated LOA3 user, there's no way for users to
trigger sign-in through the UI — clicking "Sign in" navigates to endpoints that return 404.

## What Already Works

The `hasSession` localStorage mechanism already enables a logged-in experience:

1. `Main.jsx:115` checks `localStorage.getItem('hasSession')` on every page load
2. If truthy, calls `initializeProfile()` → fetches `GET /v0/user`
3. `GET /v0/user` is already mocked in `api/mock.js` → returns authenticated user
4. User appears logged in with full profile data

**Quick workaround** (already documented in the README):
```
localStorage.setItem('hasSession', true)
// refresh the page
```

This works today on the Vercel deployment but requires developer tools access.

## What's Missing

The **UI sign-in flow** — clicking buttons in the sign-in modal — fails because:

1. **IAM session endpoints not mocked**: Regular sign-in buttons call
   `GET /v1/sessions/<csp>/new` (e.g., `/v1/sessions/idme/new`). This endpoint isn't
   handled by the mock, and `/v1/*` paths aren't even rewritten in `vercel.json`.

2. **OAuth endpoints not mocked**: The `MockAuthButton` (visible on localhost builds)
   calls `GET /v0/sign_in/authorize` and `POST /v0/sign_in/token`. Neither is mocked.

3. **Auth callback app not built**: Both flows redirect to `/auth/login/callback`, but
   the `auth` app isn't included in the Vercel build (`script/vercel-build.sh` only
   builds `static-pages,facilities,hca`).

## Two Sign-In Paths

1. **IAM flow** (regular sign-in buttons in the header modal):
   `login()` → `sessionTypeUrl()` → `GET /v1/sessions/<csp>/new` → server redirects to
   `/auth/login/callback?auth=success&type=<csp>` → AuthApp fetches `/v0/user` → session set

2. **OAuth flow** (MockAuthButton, or `?OAuth=true` in URL):
   `mockLogin()` → `createOAuthRequest()` → `GET /v0/sign_in/authorize?type=<csp>&state=<s>&...`
   → server redirects to `/auth/login/callback?code=<c>&state=<s>&type=<csp>` →
   AuthApp exchanges code via `POST /v0/sign_in/token` → session set

## Solution

Three changes to make both sign-in paths work through the UI:

---

### 1. Update `api/mock.js` — Add sign-in mock endpoints

**Refactor the handler**: Currently `matchRoute` returns static JSON objects. The new
sign-in routes need to perform redirects and set cookies, so route values should support
functions `(req, res, url) => ...` in addition to plain objects. The main handler checks
if the matched value is a function and calls it, otherwise JSON-serializes it as before.

**IAM session endpoints** (regular sign-in buttons):

| Route pattern | Mock behavior |
|-------|---------------|
| `GET /v1/sessions/<type>/new` | 302 redirect to `/auth/login/callback?auth=success&type=<type>` |
| `GET /v1/sessions/slo/new` | Clear `hasSession`-related state; 302 redirect to `/` |

Implementation: prefix-match on `/v1/sessions/` and extract the type from the path
(similar to the existing `/facilities_api/v2/va/` prefix match).

**OAuth endpoints** (MockAuthButton):

| Route | Mock behavior |
|-------|---------------|
| `GET /v0/sign_in/authorize` | Read `state` and `type` from query params; 302 redirect to `/auth/login/callback?code=mock-auth-code&state=<state>&type=<type>` |
| `POST /v0/sign_in/token` | Set `vagov_info_token` cookie (JSON with `access_token_expiration` and `refresh_token_expiration` ~30min/12hr ahead); return `{ data: { attributes: { access_token: "mock" } } }` |
| `POST /v0/sign_in/refresh` | Update `vagov_info_token` cookie with fresh timestamps; return 200 |
| `GET /v0/sign_in/logout` | Clear `vagov_info_token` cookie; 302 redirect to `/` |

### 2. Update `script/vercel-build.sh` — Build the auth callback app

Change the webpack entry list from:
```
entry=static-pages,facilities,hca
```
to:
```
entry=static-pages,facilities,hca,auth
```

This generates `build/localhost/auth/login/callback/index.html` — the page that handles
the redirect back from sign-in.

### 3. Update `vercel.json` — Add rewrite rules

Add these rewrites (order matters — place before the catch-all app rewrites):
```json
{ "source": "/v1/:path*", "destination": "/api/mock?__original_path=/v1/:path*" },
{ "source": "/auth/login/callback", "destination": "/auth/login/callback/index.html" }
```

- `/v1/:path*` routes IAM session URLs to the mock serverless function
- `/auth/login/callback` serves the built auth app HTML for the OAuth/IAM callback

---

## Expected Flows After Implementation

### Regular sign-in (IAM — the primary path):
1. User clicks "Sign in" in header → modal opens
2. Clicks "Sign in with ID.me" → browser navigates to `/v1/sessions/idme/new?...`
3. Vercel rewrites to `/api/mock` → mock responds 302 → `/auth/login/callback?auth=success&type=idme`
4. Auth app loads → calls `GET /v0/user` (already mocked) → gets mock user profile
5. `setupProfileSession()` sets `localStorage.hasSession = true`
6. Redirects to return URL → user is logged in
7. **On subsequent page loads**: `hasSession` is in localStorage, so user stays logged in

### Mock Auth (OAuth):
1. User clicks "Sign in with mocked authentication" (MockAuthButton on localhost builds)
2. Browser navigates to `/v0/sign_in/authorize?type=logingov&client_id=vamock&state=xxx&...`
3. Mock responds 302 → `/auth/login/callback?code=mock-auth-code&state=xxx&type=logingov`
4. Auth app validates state → calls `POST /v0/sign_in/token`
5. Mock returns 200 + sets `vagov_info_token` cookie
6. Auth app fetches `GET /v0/user` → session established → redirect

### Logout:
1. User clicks sign-out → `GET /v1/sessions/slo/new`
2. Mock clears session → 302 redirect to `/`
3. `teardownProfileSession()` removes `hasSession` from localStorage

---

## Files to Modify

| File | Change |
|------|--------|
| `api/mock.js` | Add IAM session mocks, OAuth sign-in mocks; refactor handler to support function routes |
| `script/vercel-build.sh` | Add `auth` to build entry list |
| `vercel.json` | Add `/v1/:path*` and `/auth/login/callback` rewrites |

## Risks / Considerations

- **Session persistence**: `setupProfileSession()` sets `localStorage.hasSession = true`,
  so the user stays logged in across page refreshes. This is the same mechanism as local
  dev — no special Vercel handling needed.
- **Single mock user**: All sign-ins return the same LOA3 verified user (Julio Hunter).
  To test LOA1 or different users, modify `mockUser` in `api/mock.js`.
- **Cookie domain**: The `vagov_info_token` cookie from the OAuth flow works because the
  mock API and frontend share the same Vercel domain.
- **No login-page app**: The standalone `/sign-in` page (with MockAuthButton CSP selector)
  won't work unless `login-page` is also added to the build. The header sign-in modal
  is sufficient for most use cases.
