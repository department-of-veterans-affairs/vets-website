import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import { currency } from '../../utils/helpers';

export const CopaysV2 = ({ copays }) => {
  const copayTotal =
    copays?.reduce((acc, copay) => acc + copay.pHAmtDue, 0) ?? 0;
  const lastCopay =
    copays?.sort(
      (a, b) =>
        new Date(b.pSStatementDateOutput) - new Date(a.pSStatementDateOutput),
    )[0] ?? null;
  const copaysCount = copays?.length || 0;
  if (copaysCount < 1) {
    return (
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-testid="zero-debt-paragraph-v2"
      >
        Your total VA copay balance is $0.
      </p>
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5"
        data-testid="copay-card-v2"
      >
        <h3 className="vads-u-margin-top--0" data-testid="copay-due-header-v2">
          ({currency(copayTotal)})
        </h3>
        <h4 className="vads-u-margin-top--0">
          {copaysCount} copay bill
          {copaysCount > 1 ? 's' : ''}
        </h4>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Due by{' '}
          {format(new Date(lastCopay.pSStatementDateOutput), 'MMMM dd, yyyy')}
        </p>
        <CTALink
          text="Manage your VA bills"
          href="/manage-va-debt/summary/copay-balances"
          showArrow
          onClick={() =>
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'view-manage-va-copays',
            })
          }
          testId="manage-va-copays-link-v2"
        />
      </div>
    </div>
  );
};

CopaysV2.propTypes = {
  copays: PropTypes.arrayOf(
    PropTypes.shape({
      pHAmtDue: PropTypes.number.isRequired,
      pSStatementDateOutput: PropTypes.string.isRequired,
    }),
  ),
  hasError: PropTypes.bool,
};

export default CopaysV2;
