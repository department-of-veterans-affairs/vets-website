// Used to customize the <title> element in the head of the document
// for accessibility
export const customizeTitle = h1 => {
  if (h1) {
    return `${h1} | PACT Act | Veterans Affairs`;
  }

  return 'PACT Act | Veterans Affairs';
};
