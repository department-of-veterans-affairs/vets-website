import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';
import {
  CHAPTER_4,
  postOfficeOptions,
  regionOptions,
} from '../../../constants';

const question = <h4>{CHAPTER_4.PAGE_2.TITLE}</h4>;

const veteransAddressZipPage = {
  uiSchema: {
    'ui:description': question,
    isVetMilitaryBase: {
      'ui:title': CHAPTER_4.PAGE_2.QUESTION_1,
    },
    militaryBasePostOffice: radioUI({
      title: CHAPTER_4.PAGE_2.QUESTION_2,
      labels: postOfficeOptions,
      hideIf: form => !form.isVetMilitaryBase,
    }),
    militaryBaseRegion: radioUI({
      title: CHAPTER_4.PAGE_2.QUESTION_3,
      labels: regionOptions,
      hideIf: form => !form.isVetMilitaryBase,
    }),
    veteranPostalCode: {
      'ui:title': CHAPTER_4.PAGE_2.QUESTION_4,
      'ui:options': {
        hideIf: form => form.isVetMilitaryBase,
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
    required: ['veteranPostalCode'],
    properties: {
      isVetMilitaryBase: {
        type: 'boolean',
        default: false,
      },
      militaryBasePostOffice: radioSchema(Object.keys(postOfficeOptions)),
      militaryBaseRegion: radioSchema(Object.keys(regionOptions)),
      veteranPostalCode: {
        type: 'string',
        maxLength: 10,
        pattern: '^[0-9]{5}(?:-[0-9]{4})?$',
      },
    },
  },
};

export default veteransAddressZipPage;
