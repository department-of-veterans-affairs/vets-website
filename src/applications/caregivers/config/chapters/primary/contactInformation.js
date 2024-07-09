// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import CaregiverContactInfoDescription from '../../../components/FormDescriptions/CaregiverContactInfoDescription';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

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
