function isValidSSN(value) {
  return /\d\d\d-\d\d-\d\d\d\d/.test(value);
}

export default { isValidSSN };
