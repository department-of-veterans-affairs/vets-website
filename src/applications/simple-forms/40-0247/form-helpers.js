export const lowercaseKeys = obj => {
  // returns obj with all keys lowercased
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
};
