import { states } from '@department-of-veterans-affairs/platform-forms/address';
import {
  selectUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const familyMembersLocationOfResidencePage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.FAMILY_MEMBERS_LOCATION_OF_RESIDENCE.TITLE),
    familyMembersLocationOfResidence: selectUI({
      title: CHAPTER_3.FAMILY_MEMBERS_LOCATION_OF_RESIDENCE.QUESTION_1,
      errorMessages: {
        required: 'Select your location',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['familyMembersLocationOfResidence'],
    properties: {
      familyMembersLocationOfResidence: {
        type: 'string',
        enum: states.USA.map(state => state.label),
      },
    },
  },
};

export default familyMembersLocationOfResidencePage;
