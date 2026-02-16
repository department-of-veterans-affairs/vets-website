import { states } from '@department-of-veterans-affairs/platform-forms/address';
import {
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3 } from '../../../constants';

const stateOfPropertyPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.STATE_OF_PROPERTY.TITLE),
    'ui:objectViewField': PageFieldSummary,
    stateOfProperty: selectUI({
      title: CHAPTER_3.STATE_OF_PROPERTY.QUESTION_1,
      errorMessages: {
        required: 'Select state of property',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['stateOfProperty'],
    properties: {
      stateOfProperty: {
        type: 'string',
        enum: states.USA.map(state => state.label),
      },
    },
  },
};

export default stateOfPropertyPage;
