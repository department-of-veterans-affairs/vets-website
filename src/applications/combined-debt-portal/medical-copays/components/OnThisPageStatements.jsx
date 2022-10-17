import React from 'react';

export const OnThisPageStatements = () => (
  <>
    <h2>On this page</h2>
    <div className="vads-u-font-family--sans vads-u-display--flex vads-u-flex-direction--column">
      <a
        href="#account-summary"
        className="vads-u-margin-y--1 vads-u-display--flex vads-u-align-items--flex-start"
      >
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm vads-u-margin-top--0p5"
        />
        Account summary
      </a>
      <a
        href="#statement-charges"
        className="vads-u-margin-y--1 vads-u-display--flex vads-u-align-items--flex-start"
      >
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm vads-u-margin-top--0p5"
        />
        Statement charges
      </a>
      <a
        href="#statement-addresses"
        className="vads-u-margin-y--1 vads-u-display--flex vads-u-align-items--flex-start"
      >
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm vads-u-margin-top--0p5"
        />
        Statement addresses
      </a>
      <a
        href="#what-do-questions"
        className="vads-u-margin-y--1 vads-u-display--flex vads-u-align-items--flex-start"
      >
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm vads-u-margin-top--0p5"
        />
        What to do if you have questions about your statement
      </a>
    </div>
  </>
);
