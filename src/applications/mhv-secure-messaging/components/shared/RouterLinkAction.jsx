import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import manifest from '../../manifest.json';

/**
 * A wrapper component for VaLinkAction that integrates with React Router
 * for client-side navigation with high-prominence styling for primary CTAs.
 *
 * This component uses VaLinkAction, which provides action link styling:
 * - Bold text
 * - Circular icon
 * - Blue color scheme
 * - High visual prominence
 *
 * Per VA Design System guidance, use this component for:
 * - Primary calls to action in alerts ("Start a new message")
 * - Links that initiate a digital service ("Go to your inbox")
 * - Application entry points
 * - Internal links that need to "stand out from surrounding design elements"
 *
 * For external links that don't need routing, use VaLinkAction directly.
 * For standard internal navigation, use RouterLink instead.
 *
 * @see https://design.va.gov/components/link/ - Link component guidance
 * @see https://design.va.gov/components/link/action - Action Link guidance
 */
const RouterLinkAction = ({ href, text, reverse, label, ...rest }) => {
  const history = useHistory();

  const handleClick = e => {
    e.preventDefault();
    if (history) {
      history.push(href);
    } else {
      // Fallback: use window.location if not in Router context
      window.location.href = href;
    }
  };
  // Construct full URL for href attribute (accessibility/hover)
  // but still navigate to relative path for client-side routing
  // Only prepend rootUrl if href doesn't already include it
  const fullUrl = href.startsWith(manifest.rootUrl)
    ? href
    : manifest.rootUrl + href;

  const linkProps = {
    href: fullUrl,
    onClick: handleClick,
    text,
    ...rest,
  };

  // Only add label if provided
  if (label) {
    linkProps.label = label;
  }

  // Only add reverse if explicitly true
  if (reverse === true) {
    linkProps.reverse = true;
  }

  return <VaLinkAction {...linkProps} />;
};

RouterLinkAction.propTypes = {
  /** The destination path for React Router navigation (e.g., Paths.SENT or '/sent'). The component will prepend manifest.rootUrl for the href attribute while using the path for navigation. */
  href: PropTypes.string.isRequired,
  /** The link text to display */
  text: PropTypes.string.isRequired,
  /** Optional aria-label for screen readers */
  label: PropTypes.string,
  /** If true, renders with white text for dark backgrounds */
  reverse: PropTypes.bool,
};

export default RouterLinkAction;
