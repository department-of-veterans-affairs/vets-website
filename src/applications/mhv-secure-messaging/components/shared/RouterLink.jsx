import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import manifest from '../../manifest.json';

/**
 * A wrapper component for VaLink that integrates with React Router
 * for client-side navigation without full page reloads.
 *
 * This provides STANDARD link styling (not action link).
 * Use for internal navigation that doesn't need high visual prominence.
 *
 * For high-prominence CTAs, use RouterLinkAction instead.
 *
 * Per VA Design System guidance:
 * - Use VaLink for standard navigation
 * - Use VaLink active for intermediate prominence (collections, hubs)
 * - Use VaLinkAction for primary CTAs and service entry points
 *
 * @see https://design.va.gov/components/link/
 * @see https://design.va.gov/storybook/?path=/docs/components-va-link--with-router-link-support
 */
const RouterLink = ({
  href,
  text,
  reverse,
  label,
  active = false,
  ...rest
}) => {
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

  // Only add active if explicitly true
  if (active === true) {
    linkProps.active = true;
  }

  // Only add label if provided
  if (label) {
    linkProps.label = label;
  }

  // Only add reverse if explicitly true
  if (reverse === true) {
    linkProps.reverse = true;
  }

  return <VaLink {...linkProps} />;
};

RouterLink.propTypes = {
  /** The destination path for React Router navigation (e.g., Paths.SENT or '/sent'). The component will prepend manifest.rootUrl for the href attribute while using the path for navigation. */
  href: PropTypes.string.isRequired,
  /** The link text to display */
  text: PropTypes.string.isRequired,
  /** If true, renders as active link; if false (default), renders as standard link */
  active: PropTypes.bool,
  /** Optional aria-label for screen readers */
  label: PropTypes.string,
  /** If true, renders with white text for dark backgrounds */
  reverse: PropTypes.bool,
};

export default RouterLink;
