import React from 'react';
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { addressSpecifications, addressUiSchema } from '../helpers';

const uiSchema = {
  ...titleUI({
    title: 'Review your mailing address',
    description: (
      <>
        We’ll send any important information about this application to this
        address.
        <p>
          This is the mailing address we have on file for you. If you notice any
          errors, please correct them now.
        </p>
        <p>
          <b>Note:</b> If you want to update your personal information for other
          VA benefits, you can do that from your profile.
        </p>
        <p>
          <va-link href="/profile" text="Go to your profile" />
        </p>
      </>
    ),
  }),
  mailingAddress: addressUiSchema({
    baseUiSchema: addressUI({
      omit: ['street3'],
      labels: {
        street2: 'Street address line 2',
        street2Military: 'Street address line 2',
      },
    }),
    allowMilitaryAddress: true,
  }),
};

const schema = {
  type: 'object',
  properties: {
    mailingAddress: addressSchema({
      omit: ['street3'],
      extend: {
        street: {
          minLength: addressSpecifications.street.minLength,
          maxLength: addressSpecifications.street.maxLength,
        },
        street2: { maxLength: addressSpecifications.street2.maxLength },
        city: {
          minLength: addressSpecifications.city.minLength,
          maxLength: addressSpecifications.city.maxLength,
        },
        postalCode: {
          minLength: addressSpecifications.postalCode.minLength,
          maxLength: addressSpecifications.postalCode.maxLength,
        },
      },
    }),
  },
  required: ['mailingAddress'],
};

export { schema, uiSchema };
