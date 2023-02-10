/* fullNameUI.js
VA-Product-Forms team's custom version of /platform/forms-system/src/js/definitions//fullName.
This one's a function that takes an optional custom-labels object param.
*/
const customUiSchema = ({
  firstNameLabel = 'First name',
  middleNameLabel = 'Middle name',
  lastNameLabel = 'Last name',
} = {}) => {
  return {
    first: {
      'ui:title': firstNameLabel,
      'ui:autocomplete': 'given-name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    last: {
      'ui:title': lastNameLabel,
      'ui:autocomplete': 'family-name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    middle: {
      'ui:title': middleNameLabel,
      'ui:autocomplete': 'additional-name',
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:autocomplete': 'honorific-suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  };
};

export default customUiSchema;
