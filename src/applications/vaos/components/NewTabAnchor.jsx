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
 * @param {Boolean} [params.renderAriaLabel=true] Whether to render an aria-label attribute

 * @returns Wrapped anchor tag
 */
function NewTabAnchor({
  href,
  renderAriaLabel = true,
  'aria-label': label,
  ...props
}) {
  const msg = 'Link opens in a new tab.';
  const ariaLabelContent = label
    ? `${label} ${msg}`
    : `${props.children} ${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...(renderAriaLabel ? { 'aria-label': ariaLabelContent } : {})}
      {...props}
    >
      {props.children}
    </a>
  );
}

NewTabAnchor.propTypes = {
  children: PropTypes.any.isRequired,
  href: PropTypes.string.isRequired,
  'aria-label': PropTypes.string,
  renderAriaLabel: PropTypes.bool,
};

export default NewTabAnchor;
