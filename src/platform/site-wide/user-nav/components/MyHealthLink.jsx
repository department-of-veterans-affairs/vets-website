import React from 'react';
import PropTypes from 'prop-types';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';

const MyHealthLink = ({ recordNavUserEvent, isPostAuthLoading }) => {
  const recordMyHealthEvent = recordNavUserEvent('my-healthevet');
  const { href, title } = MY_HEALTH_LINK;

  return (
    <li>
      <a
        className="my-health-link"
        href={href}
        aria-disabled={isPostAuthLoading ? 'true' : undefined}
        onClick={
          isPostAuthLoading ? e => e.preventDefault() : recordMyHealthEvent
        }
      >
        {title}
      </a>
    </li>
  );
};

MyHealthLink.propTypes = {
  isPostAuthLoading: PropTypes.bool,
  recordNavUserEvent: PropTypes.func,
};

export default MyHealthLink;
