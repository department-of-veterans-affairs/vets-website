import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import AddressValidationRadio from '../../../components/FormFields/AddressValidationRadio';
import { CHAPTER_3 } from '../../../constants';

const addressValidationPage = {
  uiSchema: {
    addressValidation: {
      ...titleUI(CHAPTER_3.ADDRESS_VALIDATION.TITLE),
      'ui:widget': AddressValidationRadio,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      addressValidation: {
        type: 'string',
      },
    },
  },
};

export default addressValidationPage;
