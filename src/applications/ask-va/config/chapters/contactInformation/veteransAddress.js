import * as address from '@department-of-veterans-affairs/platform-forms-system/address';
import FormElementTitle from '../../../components/FormElementTitle';

import fullSchema from '../../0873-schema.json';

const veteransAddressPage = {
  uiSchema: {
    'ui:description': FormElementTitle({
      title: 'Veteran Contact Information',
    }),
    address: address.uiSchema('Your address'),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      address: address.schema(fullSchema, true),
    },
  },
};

export default veteransAddressPage;
