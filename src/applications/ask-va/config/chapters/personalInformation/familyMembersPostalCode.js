import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import PostalCodeHint from '../../../components/PostalCodeHint';
import { CHAPTER_3 } from '../../../constants';

const familyMembersPostalCodePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.TITLE),
    'ui:objectViewField': PageFieldSummary,
    postalCode: {
      'ui:title': CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.QUESTION_4,
      'ui:required': () => true,
      'ui:description': PostalCodeHint,
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      postalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default familyMembersPostalCodePage;
