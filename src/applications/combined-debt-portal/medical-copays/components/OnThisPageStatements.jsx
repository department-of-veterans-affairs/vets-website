import React from 'react';

export const OnThisPageStatements = () => (
  <>
    <nav aria-labelledby="on-this-page" className="on-this-page-links">
      <dl>
        <dt
          id="on-this-page"
          className="vads-u-font-family--serif vads-u-font-size--lg vads-u-margin-y--1"
        >
          On this page
        </dt>
        <dd role="definition">
          <a
            href="#account-summary"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            Account summary
          </a>
          <a
            href="#statement-charges"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            Statement charges
          </a>
          <a
            href="#statement-addresses"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            Statement addresses
          </a>
          <a
            href="#what-do-questions"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            What to do if you have questions about your statement
          </a>
        </dd>
      </dl>
    </nav>
  </>
);
