import React from 'react';
import PropTypes from 'prop-types';

function NewTabAnchor({ href, 'aria-describedby': describedBy, ...props }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby={
        describedBy ? `${describedBy} ${'new-tab-msg-1'}` : 'new-tab-msg-1'
      }
      {...props}
    >
      {props.children}
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
  children: PropTypes.element.isRequired,
};

export default NewTabAnchor;
