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
        <p>
          We’ve prefilled some of your information from VA Denver Logistics
          Center’s record. If you need to correct anything, you can edit the
          contact information.
        </p>
      </va-alert>

      <h4 className="vads-u-font-size--h3">Email address</h4>
      <span>{emailAddress || ''}</span>
      <p>
        <Link to="/edit-email-address" aria-label="Edit email address">
          Edit
        </Link>
      </p>

      <h4 className="vads-u-font-size--h3">Mailing address</h4>
      <AddressViewField formData={permanentAddress} />
      <p>
        <Link to="/edit-mailing-address" aria-label="Edit mailing address">
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
    'ui:required': () => true, // don't allow progressing without all contact info
    'ui:options': {
      hideOnReview: true,
      forceDivWrapper: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
