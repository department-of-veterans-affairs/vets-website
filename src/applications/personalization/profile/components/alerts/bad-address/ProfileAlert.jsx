import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
import { useProfileRouteMetaData } from '../../../hooks';

const handlers = {
  recordView(pageName) {
    return () =>
      recordCustomProfileEvent({
        title: pageName,
        status: 'BAI Views',
      });
  },
  recordLinkClick(linkText, pageName) {
    return () => {
      recordCustomProfileEvent({
        title: pageName,
        status: 'BAI Link Click',
        primaryButtonText: linkText,
      });
    };
  },
};

export default function ProfileAlert({ className = 'vads-u-margin-top--4' }) {
  const heading = 'Review your mailing address';
  const linkText = 'Go to your contact information to review your address';
  const pageName = useProfileRouteMetaData().name;

  return (
    <VaAlert
      status="warning"
      data-testid="bad-address-profile-alert"
      onVa-component-did-load={handlers.recordView(pageName)}
      className={className}
      role="alert"
      aria-live="polite"
      uswds
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

      <Link
        to="contact-information/#mailing-address"
        onClick={handlers.recordLinkClick(linkText, pageName)}
      >
        {linkText}
      </Link>
    </VaAlert>
  );
}

ProfileAlert.propTypes = {
  className: PropTypes.string,
};
