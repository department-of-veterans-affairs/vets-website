import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const LinkWithDescription = ({ text, href, routerHref, description }) => {
  const history = useHistory();

  function handleRouteChange(event) {
    event.preventDefault();
    history.push(routerHref);
  }

  return (
    <div
      className="vads-u-flex--1 site-grid-example"
      data-testid="comparison-tool-link"
    >
      <h2 className="vads-u-font-family--serif vads-u-margin-top--0">{text}</h2>
      <p className="vads-u-margin-top--1p5 vads-u-font-family--sans vads-u-color--gray-dark  vads-u-margin-bottom--0">
        {description}
      </p>
      <VaLinkAction
        className="vads-u-font-family--sans"
        data-testid="comparison-tool-link-action"
        href={href}
        text={`Go to ${text?.toLowerCase()}`}
        type="secondary"
        active
        onClick={handleRouteChange}
      />
    </div>
  );
};

LinkWithDescription.propTypes = {
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LinkWithDescription;
