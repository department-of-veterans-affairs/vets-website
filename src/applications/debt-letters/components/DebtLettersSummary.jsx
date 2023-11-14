import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { apiRequest } from 'platform/utilities/api';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import DebtCardsList from './DebtCardsList';
import OnThisPageLinks from './OnThisPageLinks';
import OtherVADebts from './OtherVADebts';
import {
  cdpAccessToggle,
  ALERT_TYPES,
  APP_TYPES,
  API_RESPONSES,
} from '../utils/helpers';
import alertMessage from '../utils/alert-messages';

const ErrorAlert = () => (
  <section
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        We’re sorry. Something went wrong on our end.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t view information about your current debts or download your
        debt letters because something went wrong on our end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you need help resolving debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at
        <va-telephone
          className="vads-u-margin-left--0p5"
          contact="8008270648"
        />
        .
      </p>
    </div>
  </section>
);

const EmptyItemsAlert = () => (
  <section className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
    <h2 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h4">
      Our records show that you don’t have any current debts
    </h2>

    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      If you believe that you have a debt with the VA, call the Debt Management
      Center at
      <va-telephone className="vads-u-margin-left--0p5" contact="8008270648" />.
    </p>
    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      For medical copayment debts, visit
      <a className="vads-u-margin-x--0p5" href="/health-care/pay-copay-bill/">
        Pay your VA copay bill
      </a>
      to learn about your payment options.
    </p>
  </section>
);

const renderAlert = (alertType, hasCopays) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.DEBT);
  const showOther = hasCopays > 0;
  return (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {showOther && <OtherVADebts module={APP_TYPES.COPAY} subHeading />}
      {alertType === ALERT_TYPES.ALL_ERROR && (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      )}
    </va-alert>
  );
};

const fetchCopaysResponseAsync = async () => {
  return apiRequest('/medical_copays')
    .then(response => {
      return response.data.length;
    })
    .catch(() => {
      return API_RESPONSES.ERROR;
    });
};

const DebtLettersSummary = ({ isError, isVBMSError, debts, debtLinks }) => {
  const showCDPComponents = useSelector(state => cdpAccessToggle(state));
  const [hasCopays, setHasCopays] = useState(null);

  useEffect(() => {
    scrollToTop();
    fetchCopaysResponseAsync().then(hasCopaysResponse =>
      setHasCopays(hasCopaysResponse),
    );
  }, []);

  const allDebtsFetchFailure = isVBMSError && isError;
  const allDebtsEmpty =
    !allDebtsFetchFailure && debts.length === 0 && debtLinks.length === 0;

  return (
    <>
      <VaBreadcrumbs label="Breadcrumb">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/your-debt">Your VA debt</a>
      </VaBreadcrumbs>

      <section
        className="vads-l-row vads-u-margin-x--neg2p5"
        data-testid="current-va-debt"
      >
        <h1
          data-testid="summary-page-title"
          className="vads-u-padding-x--2p5 vads-u-margin-bottom--2"
        >
          Current VA debt
        </h1>

        <div className="vads-u-display--block">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
              Check the details of VA debt you might have related to your
              education, disability compensation, or pension benefits. Find out
              how to pay your debt and what to do if you need financial
              assistance.
            </p>
            {showCDPComponents && (isError || debts.length === 0) ? (
              <>
                {isError
                  ? renderAlert(
                      hasCopays === API_RESPONSES.ERROR
                        ? ALERT_TYPES.ALL_ERROR
                        : ALERT_TYPES.ERROR,
                      hasCopays,
                    )
                  : renderAlert(ALERT_TYPES.ZERO, hasCopays)}
              </>
            ) : (
              <>
                {allDebtsFetchFailure && <ErrorAlert />}

                {allDebtsEmpty && <EmptyItemsAlert />}

                {!allDebtsFetchFailure && (
                  <>
                    <OnThisPageLinks />

                    <DebtCardsList hasCopays={hasCopays} />
                  </>
                )}

                <HowDoIPay />

                <NeedHelp />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  isError: state.debtLetters.isError,
  debtLinks: state.debtLetters.debtLinks,
  debts: state.debtLetters.debts,
});

DebtLettersSummary.propTypes = {
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string,
    }),
  ),
  isError: PropTypes.bool,
  isVBMSError: PropTypes.bool,
};

DebtLettersSummary.defaultProps = {
  isVBMSError: false,
  isError: false,
  debtLinks: [],
  debts: [],
};

export default connect(mapStateToProps)(DebtLettersSummary);
