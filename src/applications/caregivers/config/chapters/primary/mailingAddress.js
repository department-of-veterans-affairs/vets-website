// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { mailingAddress } = fullSchema.definitions;
const inputLabel = content['primary-input-label'];

const primaryMailingAddress = {
  uiSchema: {
    ...titleUI(
      content['primary-info-title--address-mailing'],
      content['caregiver-address-description--mailing'],
    ),
    primaryMailingAddress: addressUI({ label: inputLabel }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryMailingAddress: addressSchema(mailingAddress),
    },
  },
};

export default primaryMailingAddress;
