const Cookies = require('js-cookie');

// Read Google Analytics ID if available. Otherwise use a random string as a token.
export function createTokenFromCookie(cookieName) {
  return Cookies.get(cookieName)
    ? Cookies.get(cookieName)
    : Math.random()
        .toString(36)
        .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
}

// Create cookie containing token
export function setCookie(cookieName, token) {
  if (!Cookies.get(cookieName)) {
    Cookies.set(cookieName, token, { expires: 30 });
    return token;
  }
  return Cookies.get(cookieName);
}

export function getFlipperId() {
  return setCookie('FLIPPER_ID', createTokenFromCookie('_vagovRollup_gid'));
}
