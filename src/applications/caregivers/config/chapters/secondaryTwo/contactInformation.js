// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import CaregiverContactInfoDescription from '../../../components/FormDescriptions/CaregiverContactInfoDescription';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { email, phone } = fullSchema.definitions;
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
