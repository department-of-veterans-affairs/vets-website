import React, { memo } from 'react';
import PropTypes from 'prop-types';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './email-addresses/EmailInformationSection';
import LoadFail from '../alerts/LoadFail';

import PersonalHealthCareContacts from './personal-health-care-contacts';

const ContactInformationContent = ({ hasVAPServiceError, showBadAddress }) => {
  return (
    <>
      {hasVAPServiceError ? (
        <LoadFail />
      ) : (
        <InitializeVAPServiceID>
          <ContactInformationSection
            className="vads-u-margin-bottom--6"
            showBadAddress={showBadAddress}
          />
          <EmailInformationSection />
          <PersonalHealthCareContacts />
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
