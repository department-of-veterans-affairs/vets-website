import React from 'react';
import PropTypes from 'prop-types';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ recordNavUserEvent }) => {
  const recordMyHealthEvent = recordNavUserEvent('my-healthevet');
  const { href, title } = MY_HEALTH_LINK;

  return (
    <li>
      <a className="my-health-link" href={href} onClick={recordMyHealthEvent}>
        {title}
      </a>
    </li>
  );
};

MyHealthLink.propTypes = {
  recordNavUserEvent: PropTypes.func,
};

export default MyHealthLink;
