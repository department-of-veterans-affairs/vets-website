export const UPDATE_ADDRESS_CONFIRMATION = 'UPDATE_ADDRESS_CONFIRMATION';

export function updateAddressConfirmation(value) {
  return {
    type: UPDATE_ADDRESS_CONFIRMATION,
    value
  };
}
