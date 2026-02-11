import React from 'react';
import PageFieldSummary from '../../../components/PageFieldSummary';
import PostalCodeHint from '../../../components/PostalCodeHint';
import PrefillAlertAndTitle from '../../../components/PrefillAlertAndTitle';
import { CHAPTER_3 } from '../../../constants';

const PrefillAlert = () => (
  <PrefillAlertAndTitle title={CHAPTER_3.YOUR_POSTAL_CODE.TITLE} />
);

const yourPostalCodePage = {
  uiSchema: {
    'ui:description': PrefillAlert,
    'ui:objectViewField': PageFieldSummary,
    yourPostalCode: {
      'ui:title': CHAPTER_3.YOUR_POSTAL_CODE.QUESTION_4,
      'ui:required': () => true,
      'ui:description': PostalCodeHint,
      'ui:errorMessages': {
        required: 'Enter a postal code',
        pattern: 'Enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      yourPostalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default yourPostalCodePage;
