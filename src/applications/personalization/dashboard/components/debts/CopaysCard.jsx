import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import { getLatestCopay } from '../../helpers';

export const CopaysCard = ({ copays, hasError }) => {
  const latestCopay = getLatestCopay(copays) ?? null;
  const copaysCount = copays?.length || 0;

  const content = (
    <>
      {hasError ? (
        <>
          <h4
            className="vads-u-margin-y--0 vads-u-padding-bottom--1"
            data-testid="copay-due-header"
          >
            Copay bills
          </h4>
          <va-alert status="warning" slim data-testid="copay-card-alert">
            We can’t show your copay bills right now. Refresh this page or try
            again later.
          </va-alert>
        </>
      ) : (
        <>
          <h4
            className="vads-u-margin-y--0 vads-u-padding-bottom--1"
            data-testid="copay-due-header"
          >
            {copaysCount > 0 &&
              `${copaysCount} copay bill${copaysCount > 1 ? 's' : ''}`}
            {copaysCount === 0 && 'No copay bills'}
          </h4>
          {copaysCount > 0 && (
            <p className="vads-u-margin-y--0 vads-u-margin-top--0p5">
              Updated on{' '}
              {format(
                new Date(latestCopay.pSStatementDateOutput),
                'MMMM dd, yyyy',
              )}
            </p>
          )}
        </>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Manage copay balances"
          href="/manage-va-debt/summary/copay-balances"
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-link',
              'dashboard-product': 'view-manage-va-bills',
            })
          }
          data-testid="manage-va-copays-link"
        />
      </p>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2">
      <va-card>
        <div data-testid="copay-card">{content}</div>
      </va-card>
    </div>
  );
};

CopaysCard.propTypes = {
  copays: PropTypes.arrayOf(
    PropTypes.shape({
      pHAmtDue: PropTypes.number.isRequired,
      pSStatementDateOutput: PropTypes.string.isRequired,
    }),
  ),
  hasError: PropTypes.bool,
};

export default CopaysCard;
