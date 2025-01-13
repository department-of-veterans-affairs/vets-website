import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { useIsInCCPilot } from '../hooks/useIsInCCPilot';
import { routeToNextReferralPage } from '../flow';
import { selectCurrentPage } from '../redux/selectors';

function ReferralAppLinkComponent({ linkText, id }) {
  const currentPage = useSelector(selectCurrentPage);
  const history = useHistory();

  const handleClick = () => {
    return e => {
      e.preventDefault();
      recordEvent({
        event: `${GA_PREFIX}-review-upcoming-link`,
      });
      routeToNextReferralPage(history, currentPage, id);
    };
  };
  const { isInCCPilot } = useIsInCCPilot();

  return isInCCPilot ? (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className="vads-c-action-link--green vaos-hide-for-print"
      href="/"
      onClick={handleClick()}
    >
      {linkText}
    </a>
  ) : (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button
      type="button"
      className="mobile:vads-u-margin-bottom--3 vaos-hide-for-print vads-u-margin--0 mobile-lg:vads-u-margin-bottom--4"
      aria-label={linkText}
      id="schedule-button"
      onClick={handleClick()}
    >
      {linkText}
    </button>
  );
}

ReferralAppLinkComponent.propTypes = {
  id: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};
export default function ReferralAppLink({ linkText, id }) {
  const location = useLocation();
  // Only display on upcoming appointments page
  if (
    location.pathname.endsWith('pending') ||
    location.pathname.endsWith('past')
  ) {
    return null;
  }
  return <ReferralAppLinkComponent linkText={linkText} id={id} />;
}

ReferralAppLink.propTypes = {
  id: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};
