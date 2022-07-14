export const isUserAgentIE = (userAgent = '') => {
  // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
  // This regex will match IE9-11, at least, but will not match Edge or the other modern browsers.
  const rxIE = /(?:MSIE)|(?:Trident\/[0-7]\.[0-9])/i;
  return rxIE.test(userAgent);
};

export const isBrowserIE = () => isUserAgentIE(window.navigator.userAgent);
