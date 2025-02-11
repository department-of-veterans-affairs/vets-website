import React from 'react';
import HorizontalRule from './shared/HorizontalRule';

const Footer = () => {
  return (
    <footer className="vads-u-padding-top--3 vads-u-padding-bottom--3">
      <div className="vads-l-grid-container">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--12">
            <p className="vads-u-margin--0 vads-u-font-size--lg vads-u-font-family--serif vads-u-font-weight--bold">
              Need help?
            </p>
            <HorizontalRule />
            <p className="vads-u-margin--0">
              Have questions about how messages works?
            </p>
            <p className="vads-u-margin-top--2">
              <a href="/health-care/secure-messaging">
                Learn more about messages
              </a>
            </p>
            <p className="vads-u-margin-top--1">
              Want to send a message to a care team that’s not on your list?
              Contadt your VA health facility. Ask for the My HealtheVet
              coordinator or secure messaging administrator.
            </p>
            <p className="vads-u-margin-top--1">
              <a href="/find-locations">Find your VA health facility</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
