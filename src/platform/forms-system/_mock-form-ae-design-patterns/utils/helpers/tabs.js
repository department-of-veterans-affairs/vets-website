export const getStylesForTab = tab => {
  return {
    backgroundColor: `var(${tab?.bgColor || '--vads-color-primary'})`,
    color: `var(${tab?.textColor || '--vads-color-white'})`,
  };
};
