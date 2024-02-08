import React from 'react';

export const OnThisPageDetails = () => (
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
            href="#statement-list"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            Your statements
          </a>
          <a
            href="#how-to-pay"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How to pay your copay bill
          </a>
          <a
            href="#how-to-get-financial-help"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How to get financial help for your copays
          </a>
          <a
            href="#dispute-charges"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How to dispute your copay charges
          </a>
          <a
            href="#balance-questions"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            What to do if you have questions about your balance
          </a>
        </dd>
      </dl>
    </nav>
  </>
);
