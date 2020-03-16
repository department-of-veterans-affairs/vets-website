const Cookies = require('js-cookie');

// Reads Google Analytics ID if available. Otherwise use a random string as a token.
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

// Creates a cookie containing token
export function setCookie(cookieName, token) {
  if (!Cookies.get(cookieName)) {
    Cookies.set(cookieName, token, { expires: 30 }); // Expires in 30 days
    return token;
  }
  return Cookies.get(cookieName);
}

// Gets and sets the cookie and then returns the flipper ID as a string
export function getFlipperId() {
  return setCookie('FLIPPER_ID', createTokenFromCookie('_vagovRollup_gid'));
}
