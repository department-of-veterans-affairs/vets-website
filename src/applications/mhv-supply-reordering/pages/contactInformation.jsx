import React from 'react';
import { Link } from 'react-router';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';
import UnsavedFieldNote from '../components/UnsavedFieldNote';

const Description = ({ formData }) => {
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

      <h4 className="vads-u-font-size--h3">Email address</h4>
      <span>{emailAddress || ''}</span>
      <p>
        <Link to="/edit-email" aria-label="Edit email">
          Edit
        </Link>
      </p>

      <h4 className="vads-u-font-size--h3">Shipping address</h4>
      <AddressViewField formData={permanentAddress} />
      <p>
        <Link to="/edit-shipping" aria-label="Edit shipping address">
          Edit
        </Link>
      </p>

      <UnsavedFieldNote fieldName="contact information" />
    </>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Contact information'),
    'ui:description': Description,
    'ui:options': {
      hideOnReview: false,
      forceDivWrapper: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
