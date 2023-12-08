import React from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const MyHealthLink = ({ isSSOe, recordNavUserEvent }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const newLandingPageEnabled = useToggleValue(
    TOGGLE_NAMES.mhvLandingPageEnabled,
  );
  const eventName = newLandingPageEnabled ? 'my-healthevet' : 'my-health';
  const recordMyHealthEvent = recordNavUserEvent(eventName);
  const href = newLandingPageEnabled
    ? MY_HEALTH_LINK.href
    : mhvUrl(isSSOe, 'home');
  const content = newLandingPageEnabled ? MY_HEALTH_LINK.title : 'My Health';

  return (
    <li>
      <a className="my-health-link" href={href} onClick={recordMyHealthEvent}>
        {content}
      </a>
    </li>
  );
};

MyHealthLink.propTypes = {
  isSSOe: PropTypes.bool,
  recordNavUserEvent: PropTypes.func,
};

export default MyHealthLink;
