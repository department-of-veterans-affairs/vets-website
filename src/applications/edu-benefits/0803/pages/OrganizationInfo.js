// @ts-check
import React from 'react';
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
  'view:country': {
    'ui:description': (
      <div>
        <label>Country</label>
        <p className="vads-u-font-weight--bold vads-u-margin-top--0">
          United States
        </p>
      </div>
    ),
  },
  organizationAddress: {
    ...addressNoMilitaryUI({ omit: ['country'] }),
  },
};
const schema = {
  type: 'object',
  properties: {
    organizationName: textSchema,
    'view:country': { type: 'object', properties: {} },
    organizationAddress: addressNoMilitarySchema({ omit: ['country'] }),
  },
  required: ['organizationName', 'organizationAddress'],
};

export { schema, uiSchema };
