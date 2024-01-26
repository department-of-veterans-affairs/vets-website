import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { useProfileRouteMetaData } from '../../../hooks';
import { PROFILE_PATH_NAMES } from '../../../constants';

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

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profileUseHubPage = useToggleValue(TOGGLE_NAMES.profileUseHubPage);

  // dont show the alert if the hub page is being used and we are on the personal information page
  if (
    profileUseHubPage &&
    pageName === PROFILE_PATH_NAMES.PERSONAL_INFORMATION
  ) {
    return null;
  }

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
      <p>
        <Link
          to="contact-information/#mailing-address"
          onClick={handlers.recordLinkClick(linkText, pageName)}
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
