import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import recordEvent from '~/platform/monitoring/record-event';
import classNames from 'classnames';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import DebtsCard from './DebtsCard';
import CopaysCard from './CopaysCard';
import GenericDebtCard from './GenericDebtCard';

const OutstandingDebtsError = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status={status} show-icon data-testid="outstanding-debts-error">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
          <Toggler.Enabled>
            <h4
              slot="headline"
              className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans vads-u-line-height--6 vads-u-margin-bottom--0"
            >
              We can’t show your benefit overpayments and copay bills right now.
              Refresh this page or try again later.
            </h4>
          </Toggler.Enabled>
          <Toggler.Disabled>
            <h2 slot="headline">
              We can’t access some of your financial information.
            </h2>
            <div>
              We’re sorry. We can’t access some of your financial information
              right now. We’re working to fix this problem. Please check back
              later.
            </div>
          </Toggler.Disabled>
        </Toggler>
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
  shouldShowLoadingIndicator,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const myVaAuthExpRedesignEnabled = useToggleValue(
    Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled,
  );
  const showGenericDebtCard = useToggleValue(TOGGLE_NAMES.showGenericDebtCard);

  const totalDebtsCount = debts?.length || debtsCount || 0;

  const copaysCount = copays?.length || 0;

  const hasDebtAndCopayError = hasDebtError && hasCopayError;

  const wrapperClasses = classNames({
    'vads-u-margin-top--6': !myVaAuthExpRedesignEnabled,
    'vads-u-margin-bottom-3': !myVaAuthExpRedesignEnabled,
  });

  return (
    <div className={wrapperClasses} data-testid="dashboard-section-debts">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <h3 className="vads-u-margin-top--3 vads-u-margin-bottom--2">
            Overpayments and copay bills
          </h3>
        </Toggler.Enabled>
        <Toggler.Disabled>
          <h2>Outstanding debts</h2>
        </Toggler.Disabled>
      </Toggler>
      {shouldShowLoadingIndicator && (
        <va-loading-indicator
          data-testid="debts-loading-indicator"
          message="Loading outstanding debts..."
        />
      )}
      {!shouldShowLoadingIndicator && (
        <>
          <div className="vads-l-row">
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Enabled>
                {hasDebtAndCopayError && (
                  <DashboardWidgetWrapper>
                    <OutstandingDebtsError />
                    <va-link
                      href="/manage-va-debt/summary"
                      text="View all debt information"
                      data-testid="view-all-debt-information-link"
                    />
                  </DashboardWidgetWrapper>
                )}
              </Toggler.Enabled>
            </Toggler>
            {showGenericDebtCard && (
              <DashboardWidgetWrapper>
                <GenericDebtCard />
              </DashboardWidgetWrapper>
            )}
            {!hasDebtAndCopayError && (
              <>
                {(totalDebtsCount >= 0 || hasDebtError) &&
                  !showGenericDebtCard && (
                    <DashboardWidgetWrapper>
                      <DebtsCard
                        debtsCount={totalDebtsCount}
                        hasError={hasDebtError}
                      />
                    </DashboardWidgetWrapper>
                  )}
                {(copaysCount >= 0 || hasCopayError) && (
                  <>
                    <DashboardWidgetWrapper>
                      <CopaysCard copays={copays} hasError={hasCopayError} />
                    </DashboardWidgetWrapper>
                    <Toggler
                      toggleName={
                        Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled
                      }
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
        </>
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

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebt);
