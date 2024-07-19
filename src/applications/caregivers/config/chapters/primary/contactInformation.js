import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import CaregiverContactInfoDescription from '../../../components/FormDescriptions/CaregiverContactInfoDescription';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { email, phone } = fullSchema.definitions;
const inputLabel = content['primary-input-label'];

const primaryContactInformation = {
  uiSchema: {
    ...titleUI(
      content['primary-info-title--contact'],
      CaregiverContactInfoDescription({ label: inputLabel }),
    ),
    primaryPrimaryPhoneNumber: phoneUI(`${inputLabel} primary`),
    primaryAlternativePhoneNumber: phoneUI(`${inputLabel} alternative`),
    primaryEmail: emailUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['primaryPrimaryPhoneNumber'],
    properties: {
      primaryPrimaryPhoneNumber: phone,
      primaryAlternativePhoneNumber: phone,
      primaryEmail: email,
    },
  },
};

export default primaryContactInformation;
