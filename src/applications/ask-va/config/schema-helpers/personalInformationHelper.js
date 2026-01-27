import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import { branchesOfService, suffixes } from '../../constants';
import { isBranchOfServiceRequired } from '../helpers';

export const personalInformationFormSchemas = {
  first: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  middle: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  last: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  suffix: selectSchema(suffixes),
  isVeteranDeceased: yesNoSchema,
  dateOfBirth: dateOfBirthSchema,
  branchOfService: selectSchema(branchesOfService),
};

export const aboutYourselfGeneralSchema = {
  first: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  middle: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  last: {
    type: 'string',
    pattern: '^[^0-9]*$',
    minLength: 1,
    maxLength: 30,
  },
  suffix: selectSchema(suffixes),
};

export const personalInformationAboutYourselfUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a first name',
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a last name',
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  dateOfBirth: {
    ...dateOfBirthUI(),
    'ui:required': formData =>
      !(
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm a family member of a Veteran") ||
        formData.whoIsYourQuestionAbout === "It's a general question"
      ),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.whoIsYourQuestionAbout === 'Someone else' &&
          formData.relationshipToVeteran ===
            "I'm a family member of a Veteran") ||
        formData.whoIsYourQuestionAbout === "It's a general question",
    },
  },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:required': formData => isBranchOfServiceRequired(formData),
    'ui:options': {
      uswds: true,
      hideIf: formData => !isBranchOfServiceRequired(formData),
    },
  },
};

export const aboutYourselfGeneralUISchema = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a first name',
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a last name',
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
};
