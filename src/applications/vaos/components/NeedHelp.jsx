import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export default function NeedHelp() {
  return (
    <div className="vads-u-margin-top--9 vads-u-margin-bottom--3">
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Need help?
      </h2>
      <hr
        aria-hidden="true"
        className="vads-u-margin-y--1p5 vads-u-border-color--primary"
      />
      <p className="vads-u-margin-top--0">
        For help scheduling a VA or Community Care appointment, please call{' '}
        <a href="tel:8774705947">877-470-5947</a> (if you have hearing loss,
        call TTY: 711). We’re here Monday &ndash; Friday, 8:00 a.m. to 8:00 p.m.
        ET.
      </p>
      <p className="vads-u-margin-top--0">
        For questions about joining a VA Video Connect appointment, please call{' '}
        <a href="tel:8666513180">866-651-3180</a> (if you have hearing loss,
        call TTY: 711). We’re here Monday &ndash; Saturday, 7:00 a.m. to 11:00
        p.m. ET.
      </p>
      <p className="vads-u-margin-top--0">
        <a
          href="https://veteran.apps.va.gov/feedback-web/v1/?appId=85870ADC-CC55-405E-9AC3-976A92BBBBEE"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave feedback about this application
        </a>
      </p>
    </div>
  );
}
