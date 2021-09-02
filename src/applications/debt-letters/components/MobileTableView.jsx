import React from 'react';
import moment from 'moment';

import environment from 'platform/utilities/environment';

export const MobileTableView = ({ debtLinks }) => {
  return (
    <div className="medium-screen:vads-u-display--none vads-u-border-top--1px vads-u-margin-top--2">
      {debtLinks.map(debt => (
        <div
          key={debt.documentId}
          className="vads-u-border-bottom--1px vads-u-font-family--sans"
        >
          <p className="vads-u-margin-bottom--0p5 vads-u-margin-top--2">
            <strong>{debt.typeDescription}</strong>
          </p>
          <p className="vads-u-margin-top--0">
            Received on
            <span className="vads-u-margin-left--0p5">
              {moment(new Date(debt.receivedAt)).format('MMM D, YYYY')}
            </span>
          </p>
          <p className="vads-u-margin-bottom--2">
            <a
              className="mobile-button"
              target="_blank"
              rel="noopener noreferrer"
              href={encodeURI(
                `${environment.API_URL}/v0/debt_letters/${debt.documentId}`,
              )}
            >
              Download this document
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};
