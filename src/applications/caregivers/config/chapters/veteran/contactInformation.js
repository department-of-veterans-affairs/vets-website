import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { emailUI, phoneUI } from '../../../definitions/sharedUI';
import ContactInfoDescription from '../../../components/FormDescriptions/VeteranContactInfoDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { email, phone } = FULL_SCHEMA.definitions;
const inputLabel = content['vet-input-label'];

const veteranHomeAddress = {
  uiSchema: {
    ...titleUI(content['vet-info-title--contact'], ContactInfoDescription),
    veteranPrimaryPhoneNumber: phoneUI(`${inputLabel} primary`),
    veteranAlternativePhoneNumber: phoneUI(`${inputLabel} alternative`),
    veteranEmail: emailUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['veteranPrimaryPhoneNumber'],
    properties: {
      veteranPrimaryPhoneNumber: phone,
      veteranAlternativePhoneNumber: phone,
      veteranEmail: email,
    },
  },
};

export default veteranHomeAddress;
