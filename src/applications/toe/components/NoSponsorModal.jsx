// src/applications/toe/components/NoSponsorModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const NoSponsorModal = ({ sponsorsList }) => {
  const [visible, setVisible] = useState(false);

  useEffect(
    () => {
      const hasSponsor = Array.isArray(sponsorsList) && sponsorsList.length > 0;
      setVisible(!hasSponsor);
    },
    [sponsorsList],
  );

  const handleContinue = () => {
    setVisible(false);
  };
  const handleExit = () => {
    window.location.href = 'https://www.va.gov';
  };

  return (
    <VaModal
      modalTitle="This application may not be the best fit for you"
      visible={visible}
      status="warning"
      modalClass="vads-u-max-width--5xl"
      onPrimaryButtonClick={handleContinue}
      primaryButtonText="Yes, continue"
      onSecondaryButtonClick={handleExit}
      secondaryButtonText="No, exit application"
      onCloseEvent={handleContinue}
    >
      <ul className="vads-u-margin-bottom--2">
        <li>
          If you are a Veteran or service member applying on behalf of your
          dependent, your application will be denied. Your dependent must apply
          from their own ID.me or Login.gov account.
        </li>
        <li>
          If you believe you’re an eligible dependent receiving benefits through{' '}
          <a
            href="https://milconnect.dmdc.osd.mil/milconnect/"
            target="_blank"
            rel="noopener noreferrer"
          >
            milConnect
          </a>{' '}
          and need more info, contact VA at{' '}
          <a
            href="https://ask.va.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask.VA.gov
          </a>
          .
        </li>
        <li>
          If you are a Veteran or service member applying for a benefit based on
          your own service,{' '}
          <a
            href="/education/apply-for-gi-bill-form-22-1990/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            apply using VA Form 22-1990
          </a>
          .
        </li>
      </ul>
      <p className="vads-u-margin--0">
        By continuing this claim, you acknowledge your claim may be denied.
      </p>
    </VaModal>
  );
};

NoSponsorModal.propTypes = {
  sponsorsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      relationship: PropTypes.string,
    }),
  ),
};
NoSponsorModal.defaultProps = { sponsorsList: [] };

export default NoSponsorModal;
