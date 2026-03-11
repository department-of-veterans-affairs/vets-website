import React from 'react';
import PropTypes from 'prop-types';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ recordNavUserEvent, isProfileLoading }) => {
  const recordMyHealthEvent = recordNavUserEvent('my-healthevet');
  const { href, title } = MY_HEALTH_LINK;

  if (isProfileLoading) return null;

  return (
    <li>
      <a className="my-health-link" href={href} onClick={recordMyHealthEvent}>
        {title}
      </a>
    </li>
  );
};

MyHealthLink.propTypes = {
  isProfileLoading: PropTypes.bool,
  recordNavUserEvent: PropTypes.func,
};

export default MyHealthLink;
