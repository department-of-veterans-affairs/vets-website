import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';
import {
  fetchDebts,
  fetchCopays,
} from '~/applications/personalization/dashboard/actions/debts';
import DebtsCardV2 from './DebtsCardV2';
import CopaysCardV2 from './CopaysCardV2';

const NoOutstandingDebtsText = () => {
  return (
    <p
      className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
      data-testid="no-outstanding-debts-text"
    >
      You have no overpayment debts or copays.
    </p>
  );
};

const OutstandingDebtsError = () => {
  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert
        status="warning"
        show-icon
        data-testid="outstanding-debts-error"
      >
        <div className="vads-u-margin-top--0">
          We’re sorry. We can’t access some of your financial information right
          now. We’re working to fix this problem. Please check back later.
        </div>
      </va-alert>
    </div>
  );
};

const PopularActionsForDebts = () => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Debts</h3>
      <IconCTALink
        href="/resources/va-debt-management"
        icon="file-invoice-dollar"
        text="Learn about VA debt"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Learn about VA debt',
            'links-list-section-header': 'Learn about VA debt',
          });
        }}
        testId="learn-va-debt-link-v2"
      />
    </>
  );
};

const BenefitPaymentsAndDebtV2 = ({
  debts,
  copays,
  hasDebtError,
  hasCopayError,
  getDebts,
  getCopays,
  shouldShowLoadingIndicator,
}) => {
  useEffect(
    () => {
      getDebts();
      getCopays();
    },
    [getDebts, getCopays],
  );

  const debtsCount = debts?.length || 0;
  const copaysCount = copays?.length || 0;
  if (shouldShowLoadingIndicator) {
    return (
      <div className="vads-u-margin-y--6">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Outstanding debts
        </h2>
        <va-loading-indicator message="Loading outstanding debts..." />
      </div>
    );
  }

  return (
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-debts-v2"
    >
      <h2>Outstanding debts</h2>
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          {(hasDebtError || hasCopayError) && (
            <>
              <OutstandingDebtsError />
              {((hasDebtError && copaysCount < 1) ||
                (hasCopayError && debtsCount < 1)) && (
                <PopularActionsForDebts />
              )}
            </>
          )}
          {!hasDebtError &&
            !hasCopayError &&
            debtsCount < 1 &&
            copaysCount < 1 && (
              <>
                <NoOutstandingDebtsText />
                <PopularActionsForDebts />
              </>
            )}
          {debtsCount > 0 && <DebtsCardV2 debts={debts} />}
          {copaysCount > 0 && <CopaysCardV2 copays={copays} />}
        </DashboardWidgetWrapper>
        {hasDebtError &&
          !hasCopayError &&
          copaysCount > 0 && (
            <DashboardWidgetWrapper>
              <PopularActionsForDebts />
            </DashboardWidgetWrapper>
          )}
      </div>
    </div>
  );
};

BenefitPaymentsAndDebtV2.propTypes = {
  copays: PropTypes.array,
  copaysError: PropTypes.bool,
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
  getCopays: PropTypes.func,
  getDebts: PropTypes.func,
  hasCopayError: PropTypes.bool,
  hasDebtError: PropTypes.bool,
  shouldShowLoadingIndicator: PropTypes.bool,
};

const mapStateToProps = state => {
  const debtsIsLoading = state.allDebts.isLoading;
  const paymentsIsLoading = state.allPayments.isLoading;
  const debts = state.allDebts.debts || [];
  const copays = state.allDebts.copays || [];
  return {
    debts,
    copays,
    hasDebtError: state.allDebts.debtsErrors.length > 0,
    hasCopayError: state.allDebts.copaysErrors.length > 0,
    shouldShowLoadingIndicator: debtsIsLoading || paymentsIsLoading,
  };
};

const mapDispatchToProps = {
  getDebts: fetchDebts,
  getCopays: fetchCopays,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebtV2);
