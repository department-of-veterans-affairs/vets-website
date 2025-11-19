import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * A wrapper component for VaLink that integrates with React Router
 * for client-side navigation without full page reloads.
 *
 * Uses VaLink with active={true} instead of VaLinkAction because VaLink supports the onClick prop
 * for React Router integration. This provides similar action-link styling.
 *
 * This implements the documented workaround pattern from the VA Design System
 * for using va-link with React Router.
 *
 * @see https://design.va.gov/storybook/?path=/docs/components-va-link--with-router-link-support
 * @see src/applications/simple-forms/form-upload/components/EditLink.jsx
 */
const RouterLinkAction = ({
  href,
  text,
  reverse,
  label,
  active = true,
  router,
  ...rest
}) => {
  function handleClick(e) {
    e.preventDefault();
    // Access router from props (injected by withRouter HOC)
    router.push(href);
  }

  const linkProps = {
    href,
    onClick: handleClick,
    text,
    ...rest,
  };

  // Only add active if true (action link styling)
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

RouterLinkAction.propTypes = {
  /** The destination path for React Router navigation */
  href: PropTypes.string.isRequired,
  /** The link text to display */
  text: PropTypes.string.isRequired,
  /** Optional aria-label for screen readers */
  label: PropTypes.string,
  /** If true, renders with white text for dark backgrounds */
  reverse: PropTypes.bool,
  /** If true (default), renders as action link; if false, renders as standard link */
  active: PropTypes.bool,
  /** Router object injected by withRouter HOC */
  router: PropTypes.object.isRequired,
};

export default withRouter(RouterLinkAction);
