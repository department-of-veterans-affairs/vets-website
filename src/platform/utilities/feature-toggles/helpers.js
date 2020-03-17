const Cookies = require('js-cookie');

const cookieName = 'FLIPPER_ID';

// Generates a random string as a token.
function generateToken() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

// Gets and sets the cookie and then returns the flipper ID as a string
function getFlipperId(_cookieName = cookieName) {
  const cookieValue = Cookies.get(_cookieName) || generateToken();
  Cookies.set(_cookieName, cookieValue, { expires: 30 }); // Expires in 30 days

  return cookieValue;
}

module.exports = { generateToken, getFlipperId };
