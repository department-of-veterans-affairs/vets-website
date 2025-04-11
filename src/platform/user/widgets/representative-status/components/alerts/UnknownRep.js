import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export function UnknownRep({ DynamicHeader }) {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="error"
      uswds
      visible
    >
      <DynamicHeader slot="headline">
        We can’t check if you have an accredited representative.
      </DynamicHeader>
      <React.Fragment key=".1">
        <p>We’re sorry. Our system isn’t working right now. Try again later.</p>

        <p className="vads-u-margin-y--0">
          If it still doesn’t work, call us at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> to check if you have
          an accredited representative.
        </p>
      </React.Fragment>
    </va-alert>
  );
}

UnknownRep.propTypes = {
  DynamicHeader: PropTypes.string,
};
