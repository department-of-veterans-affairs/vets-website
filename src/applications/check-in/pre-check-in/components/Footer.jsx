import React from 'react';

const Footer = () => (
  <footer className="row">
    <h2 className="help-heading vads-u-font-size--lg vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary">
      Need Help?
    </h2>
    <p>
      <span className="vads-u-font-weight--bold">
        For questions about your appointment or if you have a health-related
        concern,
      </span>{' '}
      call your VA provider.
      <br />
      <a href="#">Contact your VA provider</a>.
    </p>
    <p>
      <span className="vads-u-font-weight--bold">
        For questions about how to fill out your pre-check in tasks or if you
        need help with the form,
      </span>{' '}
      please call our MyVA411 main information line at{' '}
      <a href="tel:1-800-698-2411">800-698-2411</a> and select 0. We’re here
      24/7.
    </p>
    <p>
      If you have hearing loss, call <a href="tel:711">TTY: 711</a>.
    </p>
  </footer>
);

export default Footer;
