import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const Footer = ({ header, message, isPreCheckIn }) => (
  <footer>
    <h2
      data-testid="heading"
      className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary"
    >
      {header}
    </h2>
    {isPreCheckIn ? (
      <>
        <p>
          <span className="vads-u-font-weight--bold">
            For questions about your appointment or if you have a health-related
            concern,
          </span>{' '}
          call your VA provider.
          <br />
          <a href="/find-locations/">Contact your VA provider</a>.
        </p>
        <p>
          <span className="vads-u-font-weight--bold">
            For questions about how to fill out your pre-check-in tasks or if
            you need help with the form,
          </span>{' '}
          please call our MyVA411 main information line at{' '}
          <Telephone contact="8006982411" /> and select 0. We’re here 24/7.
        </p>
        <p>
          If you have hearing loss, call{' '}
          <Telephone contact="711">TTY: 711</Telephone>.
        </p>
      </>
    ) : (
      <p>Ask a staff member.</p>
    )}
    {message}
  </footer>
);

Footer.defaultProps = {
  header: 'Need Help?',
  get message() {
    return '';
  },
  isPreCheckIn: true,
};

Footer.propTypes = {
  additionalInformation: PropTypes.node,
  header: PropTypes.string,
  isPreCheckIn: PropTypes.bool,
};

export default Footer;
