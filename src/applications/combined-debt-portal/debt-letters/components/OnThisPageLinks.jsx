import React from 'react';
import PropTypes from 'prop-types';

const OnThisPageLinks = ({
  isDetailsPage,
  hasHistory,
  showDebtLetterDownload,
}) => (
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
              <va-icon
                icon="arrow_downward"
                aria-hidden="true"
                class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
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
              <va-icon
                icon="arrow_downward"
                aria-hidden="true"
                class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
              />
              Debt letter history
            </a>
          )}
          {showDebtLetterDownload && (!isDetailsPage || hasHistory) ? (
            <a
              href="#downloadDebtLetters"
              data-testid="download-jumplink"
              className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
            >
              <va-icon
                icon="arrow_downward"
                aria-hidden="true"
                class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
              />
              Download debt letters
            </a>
          ) : null}
          <a
            href="#howDoIPay"
            data-testid="howto-pay-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            How do I pay my VA debt?
          </a>
          <a
            href="#howDoIGetHelp"
            data-testid="howto-help-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
            />
            How do I get financial help?
          </a>
          <a
            href="#howDoIDispute"
            data-testid="howto-dispute-jumplink"
            className="vads-u-display--flex vads-u-align-items--baseline vads-u-padding--1 vads-u-text-decoration--none"
          >
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="vads-u-margin-right--1 vads-u-margin-bottom--neg0p25"
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
