import React from 'react';
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
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      ...titleUI('Mailing address'),
      [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: yesNoUI({
        title: "Is your mailing address the same as the Veteran's?",
        description: Description,
        labels: {
          Y: 'Yes, this is my mailing address.',
          N: "No, my address is not the same as the Veteran's.",
        },
        required: () => true,
        errorMessages: {
          required:
            "Select yes if your mailing address is the same as the Veteran's",
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        properties: {
          [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: yesNoSchema,
        },
      },
    },
  },
};
