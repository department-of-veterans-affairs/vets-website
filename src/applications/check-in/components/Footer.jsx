import React from 'react';
import PropTypes from 'prop-types';

function Footer({ header = 'Need help?', message = 'Ask a staff member.' }) {
  return (
    <footer className="row">
      <h2
        data-testid="heading"
        className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1"
      >
        {header}
      </h2>
      <p data-testid="message">{message}</p>
    </footer>
  );
}

Footer.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
};

export default Footer;
