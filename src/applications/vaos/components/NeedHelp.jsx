import React from 'react';

const NeedHelp = () => (
  <div className="vads-u-margin-bottom--3">
    <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">Need help?</h2>
    <hr className="vads-u-margin-y--1p5 vads-u-border-color--primary" />
    <p className="vads-u-margin-top--0">
      For help scheduling an appointment, or if you have questions about
      enrollment or eligibility, please call:
    </p>
    <div className="vads-u-display--flex">
      <ul className="usa-unstyled-list vads-u-flex--1">
        <li>VA facility and Community Care appointments:</li>
        <li>
          <a href="tel:8772228387" className="vads-u-font-weight--bold">
            877-222-8387
          </a>
        </li>
        <li>
          TTY:{' '}
          <a href="tel:8008778339" className="vads-u-font-weight--bold">
            800-877-8339
          </a>
        </li>
        <li>Monday &ndash; Friday, 8:00 a.m. &ndash; 8:00 p.m. ET</li>
      </ul>
      <ul className="usa-unstyled-list vads-u-padding-left--4">
        <li>VA Video Connect appointments:</li>
        <li>
          <a href="tel:8772228387" className="vads-u-font-weight--bold">
            877-222-8387
          </a>
        </li>
        <li>
          TTY:{' '}
          <a href="tel:8008778339" className="vads-u-font-weight--bold">
            800-877-8339
          </a>
        </li>
        <li>Monday &ndash; Friday, 8:00 a.m. &ndash; 8:00 p.m. ET</li>
      </ul>
    </div>
    <a href="" className="vads-u-display--block vads-u-margin-top--2">
      Leave feedback for this application
    </a>
  </div>
);

export default NeedHelp;
