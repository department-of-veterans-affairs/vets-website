import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import recordEvent from '~/platform/monitoring/record-event';
import {
  fetchDebts,
  fetchCopays,
} from '~/applications/personalization/dashboard/actions/debts';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import DebtsCard from './DebtsCard';
import CopaysCard from './CopaysCard';

const NoOutstandingDebtsText = () => {
  return (
    <p
      className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
      data-testid="no-outstanding-debts-text"
    >
      You have no overpayment debts or copays to show.
    </p>
  );
};

const OutstandingDebtsError = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status={status} show-icon data-testid="outstanding-debts-error">
        <h2 slot="headline">
          We can’t access some of your financial information.
        </h2>
        <div>
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
      <IconCTALink
        href="/resources/va-debt-management"
        icon="request_quote"
        text="Learn about VA debt"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Learn about VA debt',
            'links-list-section-header': 'Learn about VA debt',
          });
        }}
        testId="learn-va-debt-link"
      />
    </>
  );
};

const BenefitPaymentsAndDebt = ({
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
        <va-loading-indicator
          data-testid="debts-loading-indicator"
          message="Loading outstanding debts..."
        />
      </div>
    );
  }

  const hasNoOutstandingDebts = () => {
    return !hasDebtError && !hasCopayError && debtsCount < 1 && copaysCount < 1;
  };

  return (
    <div
      className="health-care-wrapper vads-u-margin-top--6 vads-u-margin-bottom-3"
      data-testid="dashboard-section-debts"
    >
      <h2>Outstanding debts</h2>
      <div className="vads-l-row">
        {(hasCopayError || hasDebtError) && (
          <>
            <DashboardWidgetWrapper>
              <OutstandingDebtsError />
            </DashboardWidgetWrapper>
            <DashboardWidgetWrapper>
              {hasDebtError && copaysCount > 0 && <PopularActionsForDebts />}
            </DashboardWidgetWrapper>
          </>
        )}
        {hasNoOutstandingDebts() && (
          <>
            <DashboardWidgetWrapper>
              <NoOutstandingDebtsText />
            </DashboardWidgetWrapper>
          </>
        )}
        {debtsCount > 0 && (
          <DashboardWidgetWrapper>
            <DebtsCard debts={debts} />
          </DashboardWidgetWrapper>
        )}
        {copaysCount > 0 && (
          <>
            <DashboardWidgetWrapper>
              <CopaysCard copays={copays} />
            </DashboardWidgetWrapper>
            <DashboardWidgetWrapper>
              {!debtsCount && !hasDebtError && <PopularActionsForDebts />}
            </DashboardWidgetWrapper>
          </>
        )}
      </div>
      {((debtsCount === 0 && copaysCount === 0) ||
        (hasCopayError && debtsCount === 0) ||
        (hasDebtError && copaysCount === 0)) && (
        <DashboardWidgetWrapper>
          <PopularActionsForDebts />
        </DashboardWidgetWrapper>
      )}
    </div>
  );
};

BenefitPaymentsAndDebt.propTypes = {
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
  const debts = state.allDebts.debts || [];
  const copays = state.allDebts.copays || [];
  return {
    debts,
    copays,
    hasDebtError: state.allDebts.debtsErrors.length > 0,
    hasCopayError: state.allDebts.copaysErrors.length > 0,
    shouldShowLoadingIndicator: debtsIsLoading,
  };
};

const mapDispatchToProps = {
  getDebts: fetchDebts,
  getCopays: fetchCopays,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebt);
