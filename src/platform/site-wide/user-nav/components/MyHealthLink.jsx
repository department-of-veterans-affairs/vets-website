import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLandingPageEnabled } from 'applications/mhv/landing-page/selectors';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ isSSOe, onClick }) => {
  const newLandingPageEnabled = useSelector(isLandingPageEnabled);
  const href = newLandingPageEnabled
    ? MY_HEALTH_LINK.href
    : mhvUrl(isSSOe, 'home');
  const content = newLandingPageEnabled ? MY_HEALTH_LINK.title : 'My Health';

  return (
    <li>
      <a className="my-health-link" href={href} onClick={onClick}>
        {content}
      </a>
    </li>
  );
};

MyHealthLink.propTypes = {
  isSSOe: PropTypes.bool,
  onClick: PropTypes.func,
};

export default MyHealthLink;
