import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3 } from '../../../constants';
import StateSelect from '../../../components/FormFields/StateSelect';

const stateOfPropertyPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.STATE_OF_PROPERTY.TITLE),
    'ui:objectViewField': PageFieldSummary,
    stateOfProperty: {
      'ui:title': CHAPTER_3.STATE_OF_PROPERTY.QUESTION_1,
      'ui:widget': StateSelect,
      'ui:errorMessages': {
        required: 'Please select state of property',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['stateOfProperty'],
    properties: {
      stateOfProperty: {
        type: 'string',
      },
    },
  },
};
export default stateOfPropertyPage;
