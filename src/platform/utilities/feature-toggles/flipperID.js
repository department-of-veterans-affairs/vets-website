const Cookies = require('js-cookie');

// Read GA Id if available otherwise use a randomString as a token
function getToken() {
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
function setFlipperCookie() {
  if (!Cookies.get('FLIPPER_ID')) {
    Cookies.set('FLIPPER_ID', getToken(), { expires: 30 });
  }
  return getToken();
}

const FLIPPER_ID = setFlipperCookie();

module.exports = FLIPPER_ID;
