import React from 'react';
import PropTypes from 'prop-types';

const OnThisPageLinks = ({ isDetailsPage, hasHistory }) => (
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
          {!isDetailsPage && (
            <a
              href="#currentDebts"
              data-testid="debts-jumplink"
              className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
            >
              <i
                aria-hidden="true"
                className="fas fa-arrow-down vads-u-margin-right--1"
              />
              Current debts
            </a>
          )}
          {hasHistory && (
            <a
              href="#debtLetterHistory"
              data-testid="history-jumplink"
              className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
            >
              <i
                aria-hidden="true"
                className="fas fa-arrow-down vads-u-margin-right--1"
              />
              Debt letter history
            </a>
          )}
          {(!isDetailsPage || hasHistory) && (
            <a
              href="#downloadDebtLetters"
              data-testid="download-jumplink"
              className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
            >
              <i
                aria-hidden="true"
                className="fas fa-arrow-down vads-u-margin-right--1"
              />
              Download debt letters
            </a>
          )}
          <a
            href="#howDoIPay"
            data-testid="howto-pay-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How do I pay my VA debt?
          </a>
          <a
            href="#howDoIGetHelp"
            data-testid="howto-help-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How do I get financial help?
          </a>
          <a
            href="#howDoIDispute"
            data-testid="howto-dispute-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <i
              aria-hidden="true"
              className="fas fa-arrow-down vads-u-margin-right--1"
            />
            How do I dispute a debt?
          </a>
        </dd>
      </dl>
    </nav>
  </>
);

OnThisPageLinks.propTypes = {
  hasHistory: PropTypes.bool,
  isDetailsPage: PropTypes.bool,
};

export default OnThisPageLinks;
