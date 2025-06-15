import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import recordEvent from '~/platform/monitoring/record-event';
import {
  fetchDebts,
  fetchCopays,
} from '~/applications/personalization/dashboard/actions/debts';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import DebtsCard from './DebtsCard';
import CopaysCard from './CopaysCard';
import GenericDebtCard from './GenericDebtCard';

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
  debtsCount,
  copays,
  hasDebtError,
  hasCopayError,
  getDebts,
  getCopays,
  shouldShowLoadingIndicator,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showGenericDebtCard = useToggleValue(TOGGLE_NAMES.showGenericDebtCard);

  useEffect(
    () => {
      if (!showGenericDebtCard) {
        getDebts(true);
      }

      getCopays();
    },
    [getDebts, getCopays, showGenericDebtCard],
  );

  const totalDebtsCount = debts?.length || debtsCount || 0;

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
    return (
      !hasDebtError && !hasCopayError && totalDebtsCount < 1 && copaysCount < 1
    );
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
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Disabled>
                <DashboardWidgetWrapper>
                  {hasDebtError &&
                    copaysCount > 0 && <PopularActionsForDebts />}
                </DashboardWidgetWrapper>
              </Toggler.Disabled>
            </Toggler>
          </>
        )}
        {hasNoOutstandingDebts() && (
          <>
            <DashboardWidgetWrapper>
              <NoOutstandingDebtsText />
            </DashboardWidgetWrapper>
          </>
        )}
        {showGenericDebtCard && (
          <DashboardWidgetWrapper>
            <GenericDebtCard />
          </DashboardWidgetWrapper>
        )}
        {totalDebtsCount > 0 &&
          !showGenericDebtCard && (
            <DashboardWidgetWrapper>
              <DebtsCard debtsCount={totalDebtsCount} />
            </DashboardWidgetWrapper>
          )}
        {copaysCount > 0 && (
          <>
            <DashboardWidgetWrapper>
              <CopaysCard copays={copays} />
            </DashboardWidgetWrapper>
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Disabled>
                <DashboardWidgetWrapper>
                  {!totalDebtsCount &&
                    !hasDebtError && <PopularActionsForDebts />}
                </DashboardWidgetWrapper>
              </Toggler.Disabled>
            </Toggler>
          </>
        )}
      </div>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Disabled>
          {((totalDebtsCount === 0 && copaysCount === 0) ||
            (hasCopayError && totalDebtsCount === 0) ||
            (hasDebtError && copaysCount === 0)) && (
            <DashboardWidgetWrapper>
              <PopularActionsForDebts />
            </DashboardWidgetWrapper>
          )}
        </Toggler.Disabled>
      </Toggler>
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
  debtsCount: PropTypes.number,
  getCopays: PropTypes.func,
  getDebts: PropTypes.func,
  hasCopayError: PropTypes.bool,
  hasDebtError: PropTypes.bool,
  shouldShowLoadingIndicator: PropTypes.bool,
};

const mapStateToProps = state => {
  const debtsIsLoading = state.allDebts.isLoading;
  const debts = state.allDebts.debts || [];
  const { debtsCount } = state.allDebts;
  const copays = state.allDebts.copays || [];
  return {
    debts,
    debtsCount,
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
