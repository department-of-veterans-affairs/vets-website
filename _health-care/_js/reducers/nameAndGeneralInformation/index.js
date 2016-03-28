const initial = {
  fullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  mothersMaidenName: '',
  socialSecurityNumber: '',
  dateOfBirth: {
    month: 0,
    day: 0,
    year: 0,
  },
  maritalStatus: null
};

function nameAndGeneralInformation(state = initial, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return Object.assign({}, state, { [action.field]: action.value });

    default:
      return state;
  }
}

export default nameAndGeneralInformation;
