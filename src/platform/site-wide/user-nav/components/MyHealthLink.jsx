import React from 'react';
import { useSelector } from 'react-redux';
import { isLandingPageEnabled } from 'applications/mhv/landing-page/selectors';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import MY_HEALTH_LINK from 'platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ isSSOe, onClick }) => {
  const state = useSelector(s => s);
  const newLandingPageEnabled = isLandingPageEnabled(state);
  if (newLandingPageEnabled) {
    return (
      <li>
        <a className="my-health-link" href={MY_HEALTH_LINK.href}>
          {MY_HEALTH_LINK.title}
        </a>
      </li>
    );
  }
  return (
    <li>
      <a
        className="my-health-link"
        href={mhvUrl(isSSOe, 'home')}
        onClick={onClick}
      >
        My Health
      </a>
    </li>
  );
};

export default MyHealthLink;
