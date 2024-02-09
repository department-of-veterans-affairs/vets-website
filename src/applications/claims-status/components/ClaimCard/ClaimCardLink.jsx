import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export default function ClaimCardLink({
  ariaLabel,
  href,
  text = 'View details',
  onClick,
}) {
  return (
    <Link
      aria-label={ariaLabel}
      className="active-va-link"
      to={href}
      onClick={onClick}
    >
      {text}
      <i aria-hidden="true" />
    </Link>
  );
}

ClaimCardLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClick: PropTypes.func,
};
