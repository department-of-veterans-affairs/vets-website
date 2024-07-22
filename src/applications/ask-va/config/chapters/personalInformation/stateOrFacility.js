import React from 'react';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3, stateOrFacilityOptions } from '../../../constants';
import { radioSchema, radioUI } from '../../schema-helpers/radioHelper';

const stateOrFacilityPage = {
  uiSchema: {
    'ui:title': FormElementTitle({ title: CHAPTER_3.STATE_OR_FACILITY.TITLE }),
    'ui:description': CHAPTER_3.STATE_OR_FACILITY.PAGE_DESCRIPTION,
    'ui:objectViewField': PageFieldSummary,
    stateOrFacility: radioUI({
      title: <strong>{CHAPTER_3.STATE_OR_FACILITY.QUESTION_1}</strong>,
      labels: stateOrFacilityOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['stateOrFacility'],
    properties: {
      stateOrFacility: radioSchema(Object.values(stateOrFacilityOptions)),
    },
  },
};

export default stateOrFacilityPage;
