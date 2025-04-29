import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';
import UnsavedFieldNote from '../components/UnsavedFieldNote';

const blankSchema = { type: 'object', properties: {} };

export const Description = ({ formData }) => {
  const { emailAddress, permanentAddress } = formData;

  return (
    <>
      <va-alert status="info">
        <p className="vads-u-margin--0">
          We’ve prefilled some of your information from VA Denver Logistics
          Center’s record. If you need to correct anything, you can edit the
          contact information.
        </p>
      </va-alert>

      <UnsavedFieldNote fieldName="contact information" />

      <h3>Email address</h3>
      <span>{emailAddress || ''}</span>
      <p>
        <Link to="/edit-email-address" aria-label="Edit email address">
          Edit
        </Link>
      </p>

      <h3>Shipping address</h3>
      <AddressViewField formData={permanentAddress} />
      <p>
        <Link to="/edit-mailing-address" aria-label="Edit mailing address">
          Edit
        </Link>
      </p>
    </>
  );
};

Description.propTypes = {
  formData: PropTypes.shape({
    emailAddress: PropTypes.string,
    permanentAddress: PropTypes.object,
  }),
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': Description,
    'ui:required': () => true,
    'ui:options': {
      forceDivWrapper: true,
    },
  },
  schema: blankSchema,
};
