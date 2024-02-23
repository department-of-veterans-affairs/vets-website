export const RECEIVED_TRAVEL_DATA = 'RECEIVED_TRAVEL_DATA';

export const receivedTravelData = payload => {
  return {
    type: RECEIVED_TRAVEL_DATA,
    payload: { payload },
  };
};
