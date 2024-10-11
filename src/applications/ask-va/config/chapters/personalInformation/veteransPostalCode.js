import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import PageFieldSummary from '../../../components/PageFieldSummary';
import {
  CHAPTER_3,
  postOfficeOptions,
  regionOptions,
} from '../../../constants';

const MilitaryBaseInfo = () => (
  <div className="">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

const veteransPostalCodePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.VETERANS_POSTAL_CODE.TITLE),
    'ui:objectViewField': PageFieldSummary,
    isMilitaryBase: {
      'ui:title':
        'Veteran receives mail outside of the United States on a U.S. military base.',
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
        title: CHAPTER_3.VETERANS_POSTAL_CODE.QUESTION_2,
        labels: postOfficeOptions,
        hideIf: form => !form.isMilitaryBase,
      }),
      'ui:required': form => form.isMilitaryBase,
    },
    militaryBaseRegion: {
      ...radioUI({
        title: CHAPTER_3.VETERANS_POSTAL_CODE.QUESTION_3,
        labels: regionOptions,
        hideIf: form => !form.isMilitaryBase,
      }),
      'ui:required': form => form.isMilitaryBase,
    },
    veteranPostalCode: {
      'ui:title': CHAPTER_3.VETERANS_POSTAL_CODE.QUESTION_4,
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
      militaryBasePostOffice: radioSchema(Object.values(postOfficeOptions)),
      militaryBaseRegion: radioSchema(Object.values(regionOptions)),
      veteranPostalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default veteransPostalCodePage;
