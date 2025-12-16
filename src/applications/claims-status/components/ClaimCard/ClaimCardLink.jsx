import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

/**
 * We use e.preventDefault() + navigate() instead of relying on href alone
 * because VaLink with href causes a full browser navigation, which:
 * - Is slower (reloads entire page)
 * - Loses React state
 *
 * This is how 'to=""' worked in the previous version of this component.
 */
export default function ClaimCardLink({
  ariaLabel,
  href,
  text = 'Details',
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = e => {
    // Prevent browser's default navigation (full page reload)
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    // Use React Router for client-side navigation
    navigate(href);
  };

  return (
    <VaLink
      aria-label={ariaLabel}
      className="vads-u-display--block vads-u-margin-top--2"
      href={`/track-claims${href}`}
      onClick={handleClick}
      text={text}
      active
    />
  );
}

ClaimCardLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClick: PropTypes.func,
};
