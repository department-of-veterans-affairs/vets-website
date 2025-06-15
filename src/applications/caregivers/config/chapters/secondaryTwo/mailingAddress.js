import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { mailingAddress } = FULL_SCHEMA.definitions;
const inputLabel = content['secondary-two-input-label'];

const secondaryTwoMailingAddress = {
  uiSchema: {
    ...titleUI(
      content['secondary-two-info-title--address-mailing'],
      content['caregiver-address-description--mailing'],
    ),
    secondaryTwoMailingAddress: addressUI({ label: inputLabel }),
  },
  schema: {
    type: 'object',
    properties: {
      secondaryTwoMailingAddress: addressSchema(mailingAddress),
    },
  },
};

export default secondaryTwoMailingAddress;
