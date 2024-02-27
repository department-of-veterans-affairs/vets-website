const receivedTravelDataHandler = (state, action) => {
  const payload = JSON.parse(JSON.stringify(action.payload));
  return { ...state, ...payload };
};

export { receivedTravelDataHandler };
