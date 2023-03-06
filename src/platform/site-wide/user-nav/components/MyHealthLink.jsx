import React from 'react';
import { useSelector } from 'react-redux';
import { isLandingPageEnabledForUser } from 'applications/mhv/landing-page/utilities/feature-toggles';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import MY_HEALTH_LINK from 'platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ isSSOe, onClick }) => {
  const { featureToggles, user } = useSelector(state => state);
  const newLandingPageEnabled = isLandingPageEnabledForUser(
    featureToggles,
    user?.profile?.signIn?.serviceName,
  );
  if (newLandingPageEnabled) {
    return (
      <li>
        <a href={MY_HEALTH_LINK.href}>{MY_HEALTH_LINK.title}</a>
      </li>
    );
  }
  return (
    <li>
      <a href={mhvUrl(isSSOe, 'home')} onClick={onClick}>
        My Health
      </a>
    </li>
  );
};

export default MyHealthLink;
