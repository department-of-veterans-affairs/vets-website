import React from 'react';
import PropTypes from 'prop-types';

function NewTabAnchor({
  href,
  anchorText,
  className,
  'aria-label': label,
  'aria-disabled': isDisabled,
  'aria-describedby': describedBy,
  onClick,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
      aria-describedby={
        describedBy ? `${describedBy} ${'new-tab-msg-1'}` : 'new-tab-msg-1'
      }
      aria-disabled={isDisabled}
      onClick={onClick}
    >
      {anchorText}
      <img
        src="/img/icons/SVG/link.svg"
        className="vaos__external-link"
        alt="Link"
        aria-hidden="true"
      />
    </a>
  );
}

NewTabAnchor.propTypes = {
  href: PropTypes.string.isRequired,
  anchorText: PropTypes.string.isRequired,
};

export default NewTabAnchor;
