import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import StateSelect from '../../../components/FormFields/StateSelect';
import { CHAPTER_3 } from '../../../constants';

const stateOfSchoolPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.STATE_OF_SCHOOL.TITLE),
    stateOfTheSchool: {
      'ui:title': CHAPTER_3.STATE_OF_SCHOOL.QUESTION_1,
      'ui:widget': StateSelect,
      'ui:errorMessages': {
        required: 'Please select school state',
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
