import React from 'react';
import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const ApplicantAddressIntro = () => (
  <div>
    <p>
      We may mail information about your application to the address you provide
      here.
    </p>
    <p>
      Changes made to your mailing address in this application will not update
      the address in your VA Profile.
    </p>
  </div>
);

const applicantAddress = {
  uiSchema: {
    'ui:title': 'Your mailing address',
    'ui:description': <ApplicantAddressIntro />,
    address: {
      ...addressUI({
        omit: ['street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};

export default applicantAddress;
