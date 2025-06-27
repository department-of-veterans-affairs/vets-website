import React from 'react';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { connect } from 'react-redux';
import {
  preparerIdentificationFields,
  veteranFields,
} from '../definitions/constants';

const DescriptionImpl = ({ formData }) => {
  if (!formData || !formData[veteranFields.parentObject]) {
    return <></>;
  }

  const veteransAddress =
    formData[veteranFields.parentObject][veteranFields.address];
  if (
    veteransAddress.street &&
    veteransAddress.city &&
    veteransAddress.state &&
    veteransAddress.postalCode
  ) {
    return (
      <p className="va-address-block vads-u-margin-left--0">
        {veteransAddress.street} <br />
        {veteransAddress.city}, {veteransAddress.state}{' '}
        {veteransAddress.postalCode}
      </p>
    );
  }
  return (
    <p className="va-address-block vads-u-margin-left--0">
      No address for the Veteran was found
    </p>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

const Description = connect(
  mapStateToProps,
  null,
)(DescriptionImpl);

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
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
      }
    : {
        [preparerIdentificationFields.parentObject]: {
          ...titleUI('Mailing address'),
          [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: yesNoUI(
            {
              title: "Is your mailing address the same as the Veteran's?",
              description: Description,
              labels: {
                Y: 'Yes, this is my mailing address.',
                N: "No, my address is not the same as the Veteran's.",
              },
              required: () => true,
            },
          ),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: {
                type: 'boolean',
              },
            },
          },
        }
      : {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: yesNoSchema,
            },
          },
        },
  },
};
