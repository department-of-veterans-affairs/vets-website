import constants from 'vets-json-schema/dist/constants.json';

const platformStates = constants.states;

export const states = {
  ...platformStates,
  USA: platformStates?.USA.map(state => {
    if (state.value === 'AA') {
      return { ...state, label: 'APO/FPO' };
    }
    if (state.value === 'AE') {
      return { ...state, label: 'APO/FPO (New York)' };
    }
    if (state.value === 'AP') {
      return { ...state, label: 'APO/FPO (San Francisco)' };
    }

    return state;
  }),
};
