import React from 'react';
import PropTypes from 'prop-types';

const OnThisPageLinks = ({ isDetailsPage, hasHistory }) => (
  <div>
    <h2>On this page</h2>
    <div className="vads-u-font-family--sans vads-u-display--flex vads-u-flex-direction--column">
      {!isDetailsPage && (
        <a
          href="#currentDebts"
          className="vads-u-margin-y--2"
          data-testid="debts-jumplink"
        >
          <i
            aria-hidden="true"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          Current debts
        </a>
      )}
      {hasHistory && (
        <a
          href="#debtLetterHistory"
          className="vads-u-margin-y--2"
          data-testid="history-jumplink"
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          Debt letter history
        </a>
      )}
      {(!isDetailsPage || hasHistory) && (
        <a
          href="#downloadDebtLetters"
          className="vads-u-margin-y--0"
          data-testid="download-jumplink"
        >
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          Download debt letters
        </a>
      )}
      <a
        href="#howDoIPay"
        className="vads-u-margin-y--2"
        data-testid="howto-pay-jumplink"
      >
        <i
          aria-hidden="true"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
        />
        How do I pay my VA debt?
      </a>
      <a
        href="#howDoIGetHelp"
        className="vads-u-margin-y--0"
        data-testid="howto-help-jumplink"
      >
        <i
          aria-hidden="true"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
        />
        How do I get financial help?
      </a>
      <a
        href="#howDoIDispute"
        className="vads-u-margin-y--2"
        data-testid="howto-dispute-jumplink"
      >
        <i
          aria-hidden="true"
          className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
        />
        How do I dispute a debt?
      </a>
    </div>
  </div>
);

OnThisPageLinks.propTypes = {
  hasHistory: PropTypes.bool,
  isDetailsPage: PropTypes.bool,
};

export default OnThisPageLinks;
