import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  active = false, // Default to standard link styling
  router,
  ...rest
}) => {
  function handleClick(e) {
    e.preventDefault();
    router.push(href);
  }

  const linkProps = {
    href,
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
  /** The destination path for React Router navigation */
  href: PropTypes.string.isRequired,
  /** Router object injected by withRouter HOC */
  router: PropTypes.object.isRequired,
  /** The link text to display */
  text: PropTypes.string.isRequired,
  /** If true, renders as active link; if false (default), renders as standard link */
  active: PropTypes.bool,
  /** Optional aria-label for screen readers */
  label: PropTypes.string,
  /** If true, renders with white text for dark backgrounds */
  reverse: PropTypes.bool,
};

export default withRouter(RouterLink);
