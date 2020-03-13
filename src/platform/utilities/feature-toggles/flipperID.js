const Cookies = require('js-cookie');

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

function setFlipperCookie() {
  if (!Cookies.get('FLIPPER_ID')) {
    Cookies.set('FLIPPER_ID', getToken(), { expires: 30 });
  }

  return getToken();
}

const FLIPPER_ID = setFlipperCookie();

// eslint-disable-next-line no-console
console.log(FLIPPER_ID);

module.exports = FLIPPER_ID;
