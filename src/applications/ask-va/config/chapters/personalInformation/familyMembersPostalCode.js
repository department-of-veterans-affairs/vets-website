import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import {
  CHAPTER_3,
  postOfficeOptions,
  regionOptions,
} from '../../../constants';
import { MilitaryBaseInfo } from '../../helpers';

const familyMembersPostalCodePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.TITLE),
    'ui:objectViewField': PageFieldSummary,
    isMilitaryBase: {
      'ui:title': CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.QUESTION_1,
      'ui:options': {
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    'view:livesOnMilitaryBaseInfo': {
      'ui:title': ' ',
      'ui:field': MilitaryBaseInfo,
      'ui:options': {
        hideOnReviewIfFalse: true,
        useDlWrap: true,
      },
    },
    militaryBasePostOffice: {
      ...radioUI({
        title: CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.QUESTION_2,
        labels: postOfficeOptions,
        hideIf: form => !form.isMilitaryBase,
      }),
      'ui:required': form => form.isMilitaryBase,
    },
    militaryBaseRegion: {
      ...radioUI({
        title: CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.QUESTION_3,
        labels: regionOptions,
        hideIf: form => !form.isMilitaryBase,
      }),
      'ui:required': form => form.isMilitaryBase,
    },
    postalCode: {
      'ui:title': CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.QUESTION_4,
      'ui:required': () => true,
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
      isMilitaryBase: {
        type: 'boolean',
        default: false,
      },
      'view:livesOnMilitaryBaseInfo': {
        type: 'string',
      },
      militaryBasePostOffice: radioSchema(Object.keys(postOfficeOptions)),
      militaryBaseRegion: radioSchema(Object.keys(regionOptions)),
      postalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default familyMembersPostalCodePage;
