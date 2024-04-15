import React from 'react';
import StateSelect from '../../../components/FormFields/StateSelect';
import { CHAPTER_3 } from '../../../constants';

const title = <h3>{CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.TITLE}</h3>;

const description = (
  <>
    <p>
      <strong>{CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.PAGE_DESCRIPTION}</strong>
    </p>
    <p>{CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.QUESTION_1}</p>
  </>
);

const schoolStOrResidencyPage = {
  uiSchema: {
    'ui:title': title,

    stateOrResidency: {
      'ui:description': description,
      schoolState: {
        'ui:title': 'School state',
        'ui:widget': StateSelect,
      },
      residencyState: {
        'ui:title': 'Residency state',
        'ui:widget': StateSelect,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['stateOrResidency'],
    properties: {
      stateOrResidency: {
        type: 'object',
        properties: {
          schoolState: {
            type: 'string',
          },
          residencyState: {
            type: 'string',
          },
        },
      },
    },
  },
};

export default schoolStOrResidencyPage;
