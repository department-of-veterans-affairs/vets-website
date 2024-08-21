import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';

function handleClick(history, linkPath) {
  return e => {
    e.preventDefault();
    recordEvent({
      event: `${GA_PREFIX}-review-upcoming-link`,
    });
    history.push(linkPath);
  };
}

function ReferralAppLinkComponent({ linkPath, linkText }) {
  const history = useHistory();
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  return featureCCDirectScheduling ? (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--2p5"
      href="/"
      onClick={handleClick(history, linkPath)}
    >
      {linkText}
    </a>
  ) : (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button
      type="button"
      className="xsmall-screen:vads-u-margin-bottom--3 vaos-hide-for-print vads-u-margin--0 small-screen:vads-u-margin-bottom--4"
      aria-label={linkText}
      id="schedule-button"
      onClick={handleClick(history, linkPath)}
    >
      {linkText}
    </button>
  );
}

export default function ReferralAppLink({ linkPath, linkText }) {
  // Only display on upcoming appointments page
  if (
    location.pathname.endsWith('pending') ||
    location.pathname.endsWith('past')
  ) {
    return null;
  }
  return <ReferralAppLinkComponent linkPath={linkPath} linkText={linkText} />;
}

ReferralAppLink.propTypes = {
  linkPath: PropTypes.string,
  linkText: PropTypes.string,
};
