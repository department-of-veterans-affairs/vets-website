// @ts-check
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI(
    'Name and address of organization issuing the license or certification',
    'To qualify for reimbursement, the organization must be located in the United States.',
  ),
  organizationName: {
    ...textUI({
      title: 'Name of organization',
      required: () => true,
      errorMessages: {
        required: 'Enter the name of the organization',
      },
    }),
  },
  organizationAddress: addressNoMilitaryUI({ omit: ['country'] }),
};

const addressSchema = addressNoMilitarySchema({ omit: ['country'] });

const schema = {
  type: 'object',
  properties: {
    organizationName: textSchema,
    organizationAddress: addressSchema,
  },
  required: ['organizationName', 'organizationAddress'],
};

export { schema, uiSchema };
