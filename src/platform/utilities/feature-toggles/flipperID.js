const Cookies = require('js-cookie');

// Read Google Analytics ID if available. Otherwise use a random string as a token.
function newToken() {
  const randomString =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);

  return Cookies.get('_vagovRollup_gid')
    ? Cookies.get('_vagovRollup_gid')
    : randomString;
}

// Create cookie containing token
function setFlipperCookie(token) {
  if (!Cookies.get('FLIPPER_ID')) {
    Cookies.set('FLIPPER_ID', token, { expires: 30 });
    return token;
  }
  return Cookies.get('FLIPPER_ID');
}

const FLIPPER_ID = setFlipperCookie(newToken());

module.exports = FLIPPER_ID;
