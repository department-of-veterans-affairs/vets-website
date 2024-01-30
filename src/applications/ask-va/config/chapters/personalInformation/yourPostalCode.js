import React from 'react';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import {
  CHAPTER_3,
  postOfficeOptions,
  regionOptions,
} from '../../../constants';

const question = <h4>{CHAPTER_3.YOUR_POSTAL_CODE.TITLE}</h4>;

const yourPostalCodePage = {
  uiSchema: {
    'ui:description': question,
    'ui:objectViewField': PageFieldSummary,
    isOnMilitaryBase: {
      'ui:title': CHAPTER_3.YOUR_POSTAL_CODE.QUESTION_1,
    },
    yourMilitaryBasePostOffice: {
      ...radioUI({
        title: CHAPTER_3.YOUR_POSTAL_CODE.QUESTION_2,
        labels: postOfficeOptions,
        hideIf: form => !form.isOnMilitaryBase,
      }),
      'ui:required': form => form.isOnMilitaryBase,
    },
    yourMilitaryBaseRegion: {
      ...radioUI({
        title: CHAPTER_3.YOUR_POSTAL_CODE.QUESTION_3,
        labels: regionOptions,
        hideIf: form => !form.isOnMilitaryBase,
      }),
      'ui:required': form => form.isOnMilitaryBase,
    },
    yourVeteranPostalCode: {
      'ui:title': CHAPTER_3.YOUR_POSTAL_CODE.QUESTION_4,
      'ui:required': form => !form.isOnMilitaryBase,
      'ui:options': {
        hideIf: form => form.isOnMilitaryBase,
      },
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
      isOnMilitaryBase: {
        type: 'boolean',
        default: false,
      },
      yourMilitaryBasePostOffice: radioSchema(Object.keys(postOfficeOptions)),
      yourMilitaryBaseRegion: radioSchema(Object.keys(regionOptions)),
      yourVeteranPostalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default yourPostalCodePage;
