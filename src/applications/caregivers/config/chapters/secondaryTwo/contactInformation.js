import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import CaregiverContactInfoDescription from '../../../components/FormDescriptions/CaregiverContactInfoDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { email, phone } = FULL_SCHEMA.definitions;
const inputLabel = content['secondary-two-input-label'];

const secondaryTwoContactInformation = {
  uiSchema: {
    ...titleUI(
      content['secondary-two-info-title--contact'],
      CaregiverContactInfoDescription({ label: inputLabel }),
    ),
    secondaryTwoPrimaryPhoneNumber: phoneUI(`${inputLabel} primary`),
    secondaryTwoAlternativePhoneNumber: phoneUI(`${inputLabel} alternative`),
    secondaryTwoEmail: emailUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['secondaryTwoPrimaryPhoneNumber'],
    properties: {
      secondaryTwoPrimaryPhoneNumber: phone,
      secondaryTwoAlternativePhoneNumber: phone,
      secondaryTwoEmail: email,
    },
  },
};

export default secondaryTwoContactInformation;
