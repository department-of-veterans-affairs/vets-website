import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordCustomProfileEvent } from '../../../util/analytics';

const handlers = {
  recordView() {
    recordCustomProfileEvent({
      title: 'Personal Info',
      status: 'BAI Views',
    });
  },
  recordLinkClick(linkText) {
    return () => {
      recordCustomProfileEvent({
        title: 'Personal Info',
        status: 'BAI Link Click',
        primaryButtonText: linkText,
      });
    };
  },
};

export default function ProfileAlert({ className = 'vads-u-margin-top--4' }) {
  const heading = 'Review your mailing address';
  const linkText = 'Go to your contact information to review your address';

  return (
    <VaAlert
      status="warning"
      data-testid="bad-address-profile-alert"
      onVa-component-did-load={handlers.recordView}
      className={className}
      role="alert"
      aria-live="polite"
    >
      <h2
        slot="headline"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-describedby="bai-alert-body"
      >
        {heading}
      </h2>
      <p id="bai-alert-body">
        The mailing address we have on file for you may not be correct.
      </p>
      <p>
        <Link
          to="contact-information/#mailing-address"
          onClick={handlers.recordLinkClick(linkText)}
        >
          {linkText}
        </Link>
      </p>
    </VaAlert>
  );
}

ProfileAlert.propTypes = {
  className: PropTypes.string,
};
