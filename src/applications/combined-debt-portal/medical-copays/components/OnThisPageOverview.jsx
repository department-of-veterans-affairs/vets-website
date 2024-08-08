import React from 'react';
import PropTypes from 'prop-types';

export const OnThisPageOverview = () => (
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
            href="#balance-list"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            Your most recent statement balances for the last six months
          </a>
          <a
            href="#how-to-pay"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            How to pay your copay bill
          </a>
          <a
            href="#how-to-get-financial-help"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            How to get financial help for your copays
          </a>
          <a
            href="#dispute-charges"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            How to dispute your copay charges
          </a>
          <a
            href="#balance-questions"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            What to do if you have questions about your balance
          </a>
        </dd>
      </dl>
    </nav>
  </>
);

OnThisPageOverview.propTypes = {
  multiple: PropTypes.bool,
};
