import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { mailingAddress } = FULL_SCHEMA.definitions;
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
