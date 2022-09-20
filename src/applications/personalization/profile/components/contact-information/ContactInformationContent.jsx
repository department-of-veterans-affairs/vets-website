import React, { memo } from 'react';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './email-addresses/EmailInformationSection';

const ContactInformationContent = ({ hasVAPServiceError, showBadAddress }) => {
  return (
    <>
      {hasVAPServiceError ? (
        <div data-testid="vap-service-not-available-error">
          <va-alert>
            <h2 slot="headline">We can’t load your contact information</h2>
            <p>
              We’re sorry. Something went wrong on our end. We can’t display
              your contact information. Please refresh the page or try again
              later.
            </p>
          </va-alert>
        </div>
      ) : (
        <InitializeVAPServiceID>
          <ContactInformationSection
            className="vads-u-margin-bottom--6"
            showBadAddress={showBadAddress}
          />
          <EmailInformationSection />
        </InitializeVAPServiceID>
      )}
    </>
  );
};

ContactInformationContent.propTypes = {
  hasVAPServiceError: PropTypes.bool,
  showBadAddress: PropTypes.bool,
};

export default memo(ContactInformationContent);
