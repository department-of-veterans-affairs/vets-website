import React from 'react';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import '../../sass/user-profile.scss';

export const Debts = ({ debts, hasError }) => {
  const debtsCount = debts?.length || 0;
  const [dismissed, setDismissed] = React.useState(false);
  if (debtsCount < 1 || dismissed) {
    return null;
  }
  if (hasError) {
    return (
      <DashboardWidgetWrapper>
        <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
          <va-alert
            status="error"
            background-only
            show-icon
            className="vads-u-margin-top--0"
            closeable
          >
            We’re sorry. Something went wrong on our end, and we can’t access
            your debt information. Please try again later or go to the debts
            tool.
          </va-alert>
        </div>
      </DashboardWidgetWrapper>
    );
  }

  return (
    <DashboardWidgetWrapper>
      <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-top--2p5">
        <va-alert
          status="warning"
          background-only
          show-icon
          className="vads-u-margin-top--0"
        >
          You have new debt.{' '}
          <CTALink
            text="Manage your VA debt"
            href="/manage-va-debt"
            onClick={() =>
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'view-manage-va-debt',
              })
            }
          />
          <button
            className="vads-u-color--black vads-u-margin--0 vads-u-font-size--base vads-u-background-color--transparent vads-u-padding-x--0 vads-u-padding-bottom--0 vads-u-padding-top--0p5 dismissible-close"
            type="button"
            aria-label="Close this modal"
            onClick={() => setDismissed(true)}
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </va-alert>
      </div>
    </DashboardWidgetWrapper>
  );
};

Debts.propTypes = {
  hasError: PropTypes.bool,
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string.isRequired,
      payeeNumber: PropTypes.string.isRequired,
      personEntitled: PropTypes.string.isRequired,
      deductionCode: PropTypes.string.isRequired,
      benefitType: PropTypes.string.isRequired,
      diaryCode: PropTypes.string.isRequired,
      diaryCodeDescription: PropTypes.string,
      amountOverpaid: PropTypes.number.isRequired,
      amountWithheld: PropTypes.number.isRequired,
      originalAr: PropTypes.number.isRequired,
      currentAr: PropTypes.number.isRequired,
      debtHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          letterCode: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
};

export default Debts;
