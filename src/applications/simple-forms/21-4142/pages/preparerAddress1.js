import React from 'react';
import {
  preparerIdentificationFields,
  veteranFields,
} from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Mailing address
        </h3>
      ),
      [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: {
        'ui:widget': 'yesNo',
        'ui:required': () => true,
        'ui:options': {
          labels: {
            Y: 'Yes, this is my mailing address',
            N: "No, my address is not the same as the Veteran's",
          },
          updateSchema: formData => {
            let mailingAddress;
            const veteransAddress =
              formData[veteranFields.parentObject][veteranFields.address];
            if (
              veteransAddress.street &&
              veteransAddress.city &&
              veteransAddress.state &&
              veteransAddress.postalCode
            ) {
              mailingAddress = (
                <p className="va-address-block vads-u-margin-left--0">
                  {veteransAddress.street} <br />
                  {veteransAddress.city}, {veteransAddress.state}{' '}
                  {veteransAddress.postalCode}
                </p>
              );
            } else {
              mailingAddress = (
                <p className="va-address-block vads-u-margin-left--0">
                  No address for the Veteran was found
                </p>
              );
            }
            const title = (
              <div>
                <p className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
                  Is your mailing address the same as the Veteran’s?
                </p>
                {mailingAddress}
              </div>
            );
            return { title };
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        properties: {
          [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
