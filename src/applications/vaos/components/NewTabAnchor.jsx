/**
 * Shared components used by the VAOS application.
 * @module components
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component wrapper for the anchor tag used to add an accessibility
 * message to announce that the link opens in a new window.
 *
 * @export
 * @param {Object} params
 * @param {String} params.href The URL that the hyperlink points to.
 * @param {String} params.children Text describing the link destination.
 * @returns Wrapped anchor tag
 */
function NewTabAnchor({ href, 'aria-label': label, ...props }) {
  const msg = 'Link opens in a new tab.';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? `${label} ${msg}` : `${props.children} ${msg}`}
      {...props}
    >
      {props.children}
    </a>
  );
}

NewTabAnchor.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default NewTabAnchor;
