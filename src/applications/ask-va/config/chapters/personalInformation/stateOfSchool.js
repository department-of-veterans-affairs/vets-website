import React from 'react';
import StateSelect from '../../../components/FormFields/StateSelect';
import { CHAPTER_3 } from '../../../constants';

const title = <h3>{CHAPTER_3.STATE_OF_SCHOOL.TITLE}</h3>;

const stateOfSchoolPage = {
  uiSchema: {
    'ui:title': title,
    stateOfTheSchool: {
      'ui:title': CHAPTER_3.STATE_OF_SCHOOL.QUESTION_1,
      'ui:widget': StateSelect,
    },
  },
  schema: {
    type: 'object',
    required: ['stateOfTheSchool'],
    properties: {
      stateOfTheSchool: {
        type: 'string',
      },
    },
  },
};

export default stateOfSchoolPage;
