import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import { getLatestCopay } from '../../helpers';

export const CopaysCard = ({ copays }) => {
  const latestCopay = getLatestCopay(copays) ?? null;
  const copaysCount = copays?.length || 0;
  if (copaysCount < 1) {
    return (
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-testid="zero-debt-paragraph"
      >
        Your total VA copay balance is $0.
      </p>
    );
  }

  const copayDueHeaderContent = `${copaysCount} copay bill${
    copaysCount > 1 ? 's' : ''
  }`;

  const content = (
    <>
      <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">Copays</h4>
      <h5
        data-testid="copay-due-header"
        className="vads-u-font-size--h4 vads-u-margin-y--0 vads-u-margin-top--0p5"
      >
        {copayDueHeaderContent}
      </h5>
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5">
        Updated on{' '}
        {format(new Date(latestCopay.pSStatementDateOutput), 'MMMM dd, yyyy')}
      </p>
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Review copay bills"
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
    <div className="vads-u-margin-bottom--3">
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
