import React from 'react';
import { useHistory } from 'react-router-dom';
import { routerVaLinkPropTypes } from './prop-types/CommonPropTypes';

/**
 * Router-aware wrapper for VADS link components.
 *
 * Most of all VADS link web components render a native <a> tag in the shadow DOM.
 * React router can't reach that <a> tag, but the browser can which triggers
 * a full page reload in React Router. This wrapper intercepts clicks and uses
 * e.preventDefault(); and history.push() for internal links to maintain SPA navigation.
 */

const RouterVaLink = ({ href, onClick, view, type, ...props }) => {
  const history = useHistory();
  const handleClick = e => {
    e.preventDefault();
    onClick?.(e);

    // Check if it's an internal link
    if (href.startsWith('/')) {
      history.push(href);
    } else {
      // Otherwise treat as normal external link
      window.location.href = href;
    }
  };

  // va-link-action gives us the circular arrow icon in front of the link
  const LinkComponent = view === 'details' ? 'va-link-action' : 'va-link';
  const linkProps = {
    href,
    onClick: handleClick,
    ...props,
  };

  if (view === 'details' && type) {
    linkProps.type = type;
  }

  return <LinkComponent {...linkProps} />;
};

RouterVaLink.propTypes = routerVaLinkPropTypes;

export default RouterVaLink;
