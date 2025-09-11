let sharedVariables = {};

export const setSharedVariable = (key, value) => {
  sharedVariables[key] = value;
};

export const getSharedVariable = key => {
  return sharedVariables[key];
};

export const clearSharedVariables = () => {
  sharedVariables = {};
};
