import React from 'react';
import StateSelect from '../../../components/FormFields/StateSelect';
import { CHAPTER_3 } from '../../../constants';

const title = <h3>{CHAPTER_3.STATE_OF_FACILITY.TITLE}</h3>;

const stateOfFacilityPage = {
  uiSchema: {
    'ui:title': title,
    stateOfTheFacility: {
      'ui:title': CHAPTER_3.STATE_OF_FACILITY.QUESTION_1,
      'ui:widget': StateSelect,
    },
  },
  schema: {
    type: 'object',
    required: ['stateOfTheFacility'],
    properties: {
      stateOfTheFacility: {
        type: 'string',
      },
    },
  },
};

export default stateOfFacilityPage;
