import Cookies from 'js-cookie';

const cookieName = 'FLIPPER_ID';

// Generates a random string as a token.
export function generateToken() {
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
export function getFlipperId(_cookieName = cookieName) {
  const cookieValue = Cookies.get(_cookieName) || generateToken();
  Cookies.set(_cookieName, cookieValue, { expires: 31 }); // Expires in 31 days

  return cookieValue;
}
