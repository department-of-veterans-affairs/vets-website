import React from 'react';
import { Link } from 'react-router';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';

const ContactInfoDescription = ({ formData }) => {
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

      <p>
        <strong>Note:</strong> Any updates you make to your contact information
        will only apply to this order. If you’d like to update for all future
        orders, you can either call us at <va-telephone contact="8003270354" />{' '}
        or change in your <a href="/profile">VA.gov profile</a>.
      </p>
    </>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Contact information'),
    'ui:description': ContactInfoDescription,
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
