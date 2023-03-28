import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';
import {
  fetchDebts,
  fetchCopays,
} from '~/applications/personalization/dashboard/actions/debts';
import DebtsCardV2 from './DebtsCardV2';
import CopaysCardV2 from './CopaysCardV2';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';

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
  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status="error" show-icon data-testid="outstanding-debts-error">
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
  canAccessCopays,
  debts,
  copays,
  hasDebtError,
  hasCopayError,
  getDebts,
  getCopays,
  shouldShowLoadingIndicator,
  shouldShowV2Dashboard,
}) => {
  useEffect(
    () => {
      getDebts();
      if (canAccessCopays) {
        getCopays();
      }
    },
    [canAccessCopays, getDebts, getCopays],
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
      className="health-care-wrapper vads-u-margin-top--6 vads-u-margin-bottom-3"
      data-testid="dashboard-section-debts-v2"
    >
      <h2>Outstanding debts</h2>
      {shouldShowV2Dashboard && (
        <>
          <div className="vads-l-row">
            {/* case 1: has debt error OR copay error; needs right-aligned link */}
            {(hasDebtError || hasCopayError) && (
              <>
                <DashboardWidgetWrapper>
                  <OutstandingDebtsError />
                </DashboardWidgetWrapper>
                {/* right-aligned:
                - debt error AND has copay */}
                <DashboardWidgetWrapper>
                  {hasDebtError &&
                    copaysCount > 0 && <PopularActionsForDebts />}
                </DashboardWidgetWrapper>
              </>
            )}

            {/* case 2: neither error AND neither has debt or copay; needs left-aligned cta link */}
            {!hasDebtError &&
              !hasCopayError &&
              debtsCount < 1 &&
              copaysCount < 1 && (
                <>
                  <DashboardWidgetWrapper>
                    <NoOutstandingDebtsText />
                  </DashboardWidgetWrapper>
                  {/* <DashboardWidgetWrapper>
                    <PopularActionsForDebts />
                  </DashboardWidgetWrapper> */}
                </>
              )}

            {/* <SingleColumnInfo
              debtsCount={debtsCount}
              copaysCount={copaysCount}
              hasCopayError={hasCopayError}
              hasDebtError={hasDebtError}
              withWrapper
            /> */}
            {/* <DashboardWidgetWrapper>
              {((hasDebtError && !hasCopayError && copaysCount > 0) ||
                (!hasDebtError &&
                  !hasCopayError &&
                  debtsCount < 1 &&
                  copaysCount > 0)) && (
                <>
                  this should be right aligend
                  <PopularActionsForDebts />
                </>
              )}
            </DashboardWidgetWrapper> */}
            {debtsCount > 0 && (
              <DashboardWidgetWrapper>
                <DebtsCardV2 debts={debts} />
              </DashboardWidgetWrapper>
            )}
            {copaysCount > 0 && (
              <DashboardWidgetWrapper>
                <CopaysCardV2 copays={copays} />
              </DashboardWidgetWrapper>
            )}
            {/* {hasDebtError &&
              copaysCount > 0 && (
                <DashboardWidgetWrapper>
                  <PopularActionsForDebts />
                </DashboardWidgetWrapper>
              )} */}
            {/* <DashboardWidgetWrapper>
              <PopularActionsForDebts />
            </DashboardWidgetWrapper> */}
          </div>
        </>
      )}
      {!shouldShowV2Dashboard && (
        <>
          <DashboardWidgetWrapper>
            {(hasDebtError || hasCopayError) && (
              <>
                <OutstandingDebtsError />
                {/* right-aligned:
                - debt error AND has copay */}
                {/* {hasDebtError && copaysCount > 0 && <PopularActionsForDebts />} */}
              </>
            )}
            {!hasDebtError &&
              !hasCopayError &&
              debtsCount < 1 &&
              copaysCount < 1 && (
                <>
                  <DashboardWidgetWrapper>
                    <NoOutstandingDebtsText />
                  </DashboardWidgetWrapper>
                  <DashboardWidgetWrapper>
                    <PopularActionsForDebts />
                  </DashboardWidgetWrapper>
                </>
              )}
            {debtsCount > 0 && <DebtsCardV2 debts={debts} />}
            {copaysCount > 0 && <CopaysCardV2 copays={copays} />}
            {copaysCount > 0 && hasDebtError && <PopularActionsForDebts />}
          </DashboardWidgetWrapper>
        </>
      )}

      {/* left-aligned when:
        - has no debts nor copays
        - copay error with no debts
        - debts error with no copays */}
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

BenefitPaymentsAndDebtV2.propTypes = {
  canAccessCopays: PropTypes.bool,
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
  shouldShowV2Dashboard: PropTypes.bool,
};

const mapStateToProps = state => {
  const canAccessCopays = canAccess(state)[API_NAMES.MEDICAL_COPAYS];
  const debtsIsLoading = state.allDebts.isLoading;
  const debts = state.allDebts.debts || [];
  const copays = state.allDebts.copays || [];
  const shouldShowV2Dashboard = toggleValues(state)[
    FEATURE_FLAG_NAMES.showMyVADashboardV2
  ];
  return {
    canAccessCopays,
    debts,
    copays,
    hasDebtError: state.allDebts.debtsErrors.length > 0,
    hasCopayError: state.allDebts.copaysErrors.length > 0,
    shouldShowLoadingIndicator: debtsIsLoading,
    shouldShowV2Dashboard,
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
