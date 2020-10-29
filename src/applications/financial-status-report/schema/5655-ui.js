import VeteranInfoBox from '../components/VeteranInfoBox';

export default {
  veteranInfoUI: {
    'ui:field': VeteranInfoBox,
    first: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    last: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    middle: {
      'ui:title': 'Middle name',
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
};
