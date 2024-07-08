// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import CaregiverContactInfoDescription from '../../../components/FormDescriptions/CaregiverContactInfoDescription';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { email, phone } = fullSchema.definitions;
const inputLabel = content['secondary-one-input-label'];

const secondaryOneContactInformation = {
  uiSchema: {
    ...titleUI(
      content['secondary-one-info-title--contact'],
      CaregiverContactInfoDescription({ label: inputLabel }),
    ),
    secondaryOnePrimaryPhoneNumber: phoneUI(`${inputLabel} primary`),
    secondaryOneAlternativePhoneNumber: phoneUI(`${inputLabel} alternative`),
    secondaryOneEmail: emailUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['secondaryOnePrimaryPhoneNumber'],
    properties: {
      secondaryOnePrimaryPhoneNumber: phone,
      secondaryOneAlternativePhoneNumber: phone,
      secondaryOneEmail: email,
    },
  },
};

export default secondaryOneContactInformation;
