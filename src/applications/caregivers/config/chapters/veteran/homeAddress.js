import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VeteranCountyDescription } from '../../../components/FormDescriptions/AddressCountyDescriptions';
import { addressUI } from '../../../definitions/sharedUI';
import { addressSchema } from '../../../definitions/sharedSchema';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { address } = FULL_SCHEMA.definitions;
const inputLabel = content['vet-input-label'];
const inputHint = content['vet-address-street-hint'];

const veteranHomeAddress = {
  uiSchema: {
    ...titleUI(
      content['vet-info-title--address'],
      content['vet-address-description'],
    ),
    veteranAddress: addressUI({
      label: inputLabel,
      hint: inputHint,
      requireCounty: true,
      countyDescription: VeteranCountyDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: addressSchema(address),
    },
  },
};

export default veteranHomeAddress;
