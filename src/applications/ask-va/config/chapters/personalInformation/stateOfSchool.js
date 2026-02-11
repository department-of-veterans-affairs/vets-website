import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import StateSelect from '../../../components/FormFields/StateSelect';
import { CHAPTER_3 } from '../../../constants';

const stateOfSchoolPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.STATE_OF_SCHOOL.TITLE),
    stateOfTheSchool: {
      'ui:title': CHAPTER_3.STATE_OF_SCHOOL.QUESTION_1,
      'ui:widget': StateSelect,
      'ui:errorMessages': {
        required: 'Select school state',
      },
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
