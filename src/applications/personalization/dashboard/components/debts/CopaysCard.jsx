import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { getLatestCopay } from '../../helpers';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';

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

  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--3">
      <div
        className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5"
        data-testid="copay-card"
      >
        <h3 className="vads-u-margin-top--0" data-testid="copay-due-header">
          {copayDueHeaderContent}
        </h3>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Updated on{' '}
          {format(new Date(latestCopay.pSStatementDateOutput), 'MMMM dd, yyyy')}
        </p>
        <CTALink
          text="Manage your VA bills"
          href="/manage-va-debt/summary/copay-balances"
          showArrow
          className="vads-u-font-weight--bold"
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-link',
              'dashboard-product': 'view-manage-va-bills',
            })
          }
          testId="manage-va-copays-link"
        />
      </div>
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
