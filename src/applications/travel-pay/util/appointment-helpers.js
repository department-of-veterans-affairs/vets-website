export const getPractionerName = practitioners => {
  return `${practitioners[0].name.given?.join(' ')} ${
    practitioners[0].name?.family
  }`;
};
