// GlobalStateManager.js
let globalState = {
  spouseChanged: false,
};

export const setGlobalState = newState => {
  globalState = { ...globalState, ...newState };
};

export const getGlobalState = () => globalState;
