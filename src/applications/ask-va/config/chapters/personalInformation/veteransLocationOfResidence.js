import { states } from '@department-of-veterans-affairs/platform-forms/address';
import {
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const veteransLocationOfResidencePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.VETERAN_LOCATION_OF_RESIDENCE.TITLE),
    locationOfResidence: selectUI({
      title: CHAPTER_3.VETERAN_LOCATION_OF_RESIDENCE.QUESTION_1,
      errorMessages: {
        required: 'Please select your location',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['locationOfResidence'],
    properties: {
      locationOfResidence: {
        type: 'string',
        enum: states.USA.map(state => state.label),
      },
    },
  },
};

export default veteransLocationOfResidencePage;
