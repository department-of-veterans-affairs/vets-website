import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ContactInformationSection from './ContactInformationSection';
import { EmailInformationSection } from './email-addresses';
import LoadFail from '../alerts/LoadFail';
import PhoneNumbersTable from './phone-numbers/PhoneNumbersTable';

const ContactInformationContent = ({ hasVAPServiceError, showBadAddress }) => {
  return (
    <>
      {hasVAPServiceError ? (
        <LoadFail />
      ) : (
        <>
          <ContactInformationSection
            className="vads-u-margin-bottom--6"
            showBadAddress={showBadAddress}
          />
          <EmailInformationSection />
          <PhoneNumbersTable className="vads-u-margin-bottom--6" />
        </>
      )}
    </>
  );
};

ContactInformationContent.propTypes = {
  hasVAPServiceError: PropTypes.bool,
  showBadAddress: PropTypes.bool,
};

export default memo(ContactInformationContent);
