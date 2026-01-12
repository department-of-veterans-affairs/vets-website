import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  selectUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import {
  branchesOfService,
  CHAPTER_3,
  suffixes,
  yesNoOptions,
} from '../../../constants';
import { isBranchOfServiceRequired } from '../../helpers';

const aboutTheVeteranPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_THE_VET.TITLE),
    aboutTheVeteran: {
      first: {
        'ui:title': 'First name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'given-name',
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Please provide the Veteran's first name",
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'additional-name',
      },
      last: {
        'ui:title': 'Last name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'family-name',
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Please provide the Veteran's last name",
        },
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:webComponentField': VaSelectField,
        'ui:autocomplete': 'honorific-suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
        },
      },
      isVeteranDeceased: yesNoUI({
        title: CHAPTER_3.VET_DECEASED.TITLE,
        labels: yesNoOptions,
        errorMessages: {
          required: 'Please let us know if the Veteran is deceased',
        },
      }),
      branchOfService: selectUI({
        title: CHAPTER_3.VETERANS_BRANCH_OF_SERVICE.TITLE,
        errorMessages: {
          required: CHAPTER_3.VETERANS_BRANCH_OF_SERVICE.ERROR,
        },
        required: formData => {
          return isBranchOfServiceRequired(formData);
        },
        hideIf: formData => {
          return !isBranchOfServiceRequired(formData);
        },
        hideEmptyValueInReview: true,
      }),
      dateOfBirth: dateOfBirthUI({
        errorMessages: {
          required: "Please provide the Veteran's date of birth",
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      aboutTheVeteran: {
        type: 'object',
        required: ['first', 'last', 'isVeteranDeceased', 'dateOfBirth'],
        properties: {
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
          branchOfService: {
            type: 'string',
            enum: branchesOfService,
          },
          dateOfBirth: dateOfBirthSchema,
        },
      },
    },
  },
};

export default aboutTheVeteranPage;
