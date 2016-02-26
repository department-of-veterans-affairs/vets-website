function isValidSSN(value) {
  return /^\d{3}-\d{2}-\d{4}$/.test(value);
}

export default { isValidSSN };
