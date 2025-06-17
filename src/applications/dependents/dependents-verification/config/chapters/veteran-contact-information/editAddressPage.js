import React from 'react';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditAddressPage from '../../../components/EditAddressPage';

export default {
  title: 'Edit mailing address',
  path: '/veteran-contact-information/mailing-address',
  CustomPage: props =>
    props ? (
      <EditAddressPage
        {...props}
        schema={{
          type: 'object',
          properties: {
            address: addressSchema(),
          },
        }}
        uiSchema={{
          address: addressUI(),
        }}
      />
    ) : null,
  CustomPageReview: null,
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {},
  },
};
