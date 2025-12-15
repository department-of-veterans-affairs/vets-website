import React from 'react';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

export default function ClaimCardLink({
  ariaLabel,
  href,
  text = 'Details',
  onClick,
}) {
  return (
    <>
      <VaLink
        aria-label={ariaLabel}
        className="vads-u-display--block vads-u-margin-top--2"
        href={`/track-claims${href}`}
        onClick={onClick}
        text={text}
        active
      />
    </>
  );
}

ClaimCardLink.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClick: PropTypes.func,
};
