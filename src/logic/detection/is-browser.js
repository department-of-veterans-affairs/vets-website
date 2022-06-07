// This regex will match IE9-11, at least, but will not match Edge or the other modern browsers.
const rxIE = /Trident\/[0-7]\.[0-9]/i;

export const isIE = rxIE.test(window.navigator.userAgent);
