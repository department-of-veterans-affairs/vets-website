import { states } from '@department-of-veterans-affairs/platform-forms/address';
import {
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_3 } from '../../../constants';

const yourLocationOfResidencePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.YOUR_LOCATION_OF_RESIDENCE.TITLE),
    'ui:objectViewField': PageFieldSummary,
    yourLocationOfResidence: selectUI({
      title: CHAPTER_3.YOUR_LOCATION_OF_RESIDENCE.QUESTION_1,
      errorMessages: {
        required: 'Select your location of residence',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourLocationOfResidence'],
    properties: {
      yourLocationOfResidence: {
        type: 'string',
        enum: states.USA.map(state => state.label),
      },
    },
  },
};

export default yourLocationOfResidencePage;
