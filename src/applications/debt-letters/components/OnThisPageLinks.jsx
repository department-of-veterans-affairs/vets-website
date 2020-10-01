import React from 'react';

export const OnThisPageLinks = ({ isDetailsPage }) => {
  return (
    <div>
      <h2 className="vads-u-font-size--h3">On this page</h2>
      <div className="vads-u-font-family--sans vads-u-display--flex vads-u-flex-direction--column">
        {!isDetailsPage && (
          <a href="#currentDebts" className="vads-u-margin-y--2">
            <i
              aria-hidden="true"
              role="img"
              className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
            />
            Current debts
          </a>
        )}
        {isDetailsPage && (
          <a href="#debtLetterHistory" className="vads-u-margin-y--2">
            <i
              aria-hidden="true"
              role="img"
              className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
            />
            Debt letter history
          </a>
        )}
        <a href="#downloadDebtLetters" className="vads-u-margin-y--0">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          Download debt letters
        </a>
        <a href="#howDoIPay" className="vads-u-margin-y--2">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          How do I pay my VA debt?
        </a>
        <a href="#howDoIGetHelp" className="vads-u-margin-y--0">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          How do I get financial help?
        </a>
        <a href="#howDoIDispute" className="vads-u-margin-y--2">
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-arrow-down vads-u-padding-right--1 vads-u-font-size--sm"
          />
          How do I dispute a debt?
        </a>
      </div>
    </div>
  );
};
