import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

export default function ClaimCardLink({
  ariaLabel,
  href,
  text = 'Details',
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
      <va-icon icon="chevron_right" size={3} aria-hidden="true" />
    </Link>
  );
}

ClaimCardLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClick: PropTypes.func,
};
