import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { mailingAddress } = fullSchema.definitions;
const inputLabel = content['secondary-one-input-label'];

const secondaryOneMailingAddress = {
  uiSchema: {
    ...titleUI(
      content['secondary-one-info-title--address-mailing'],
      content['caregiver-address-description--mailing'],
    ),
    secondaryOneMailingAddress: addressUI({ label: inputLabel }),
  },
  schema: {
    type: 'object',
    properties: {
      secondaryOneMailingAddress: addressSchema(mailingAddress),
    },
  },
};

export default secondaryOneMailingAddress;
