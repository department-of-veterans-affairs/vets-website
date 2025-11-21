import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * A wrapper component for VaLink that integrates with React Router
 * for client-side navigation with high-prominence styling for primary CTAs.
 *
 * IMPORTANT TECHNICAL NOTE:
 * This component uses VaLink with active={true}, NOT VaLinkAction.
 *
 * Why? VaLinkAction doesn't expose an onClick prop needed for React Router
 * integration. VaLink with active={true} provides the closest visual styling:
 * - Bold text
 * - Right arrow icon (chevron)
 * - Blue color scheme
 *
 * While not pixel-perfect to VaLinkAction (which uses circular icon), the
 * "active link" styling provides sufficient visual prominence for CTAs.
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
 * @see https://design.va.gov/components/link/action - Action Link guidance
 * @see https://design.va.gov/components/link/ - Active Link vs Action Link
 * @see https://design.va.gov/storybook/?path=/docs/components-va-link--with-router-link-support
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
