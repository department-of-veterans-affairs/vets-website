export const isSearchTermValid = term => {
  if (!term) {
    return false;
  }

  return term.trim().length <= 255;
};
