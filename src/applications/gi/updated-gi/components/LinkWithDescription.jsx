import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const LinkWithDescription = ({ text, href, routerHref, description }) => {
  const history = useHistory();

  function handleRouteChange(event) {
    event.preventDefault();
    history.push(routerHref);
  }

  return (
    <div className="vads-u-flex--1 site-grid-example">
      <VaLink
        className="comparison-tool-link vads-u-font-size--h3 vads-u-font-family--serif"
        href={href}
        text={text}
        active
        onClick={handleRouteChange}
      />
      <p className="vads-u-margin-top--1p5 vads-u-font-family--sans vads-u-color--gray-dark">
        {description}
      </p>
    </div>
  );
};

LinkWithDescription.propTypes = {
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LinkWithDescription;
