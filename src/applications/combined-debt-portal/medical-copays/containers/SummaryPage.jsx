import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import {
  VaBreadcrumbs,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import {
  setPageFocus,
  sortStatementsByDate,
  ALERT_TYPES,
  APP_TYPES,
  showVHAPaymentHistory,
} from '../../combined/utils/helpers';
import Balances from '../components/Balances';
import OtherVADebts from '../../combined/components/OtherVADebts';
import alertMessage from '../../combined/utils/alert-messages';
import NeedHelpCopay from '../components/NeedHelpCopay';
import CopayAlertContainer from '../components/CopayAlertContainer';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const renderAlert = (alertType, debts) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.COPAY);
  const showOther = debts > 0;
  const showVAReturnLink = !showOther && alertType !== ALERT_TYPES.ALL_ERROR;

  return (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {alertInfo.secondHeader ? (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      ) : null}
      {showVAReturnLink ? (
        <va-link
          active
          class="vads-u-margin-top--2"
          data-testid="return-to-va-link"
          href="https://va.gov"
          text="Return to VA.gov"
        />
      ) : null}
      {showOther && <OtherVADebts module={APP_TYPES.DEBT} subHeading />}
    </va-alert>
  );
};

const renderOtherVA = (debtLength, debtError) => {
  const alertInfo = alertMessage(ALERT_TYPES.ERROR, APP_TYPES.DEBT);
  if (debtLength > 0) {
    return <OtherVADebts module={APP_TYPES.DEBT} />;
  }
  if (debtError) {
    return (
      <>
        <h2>Overpayment balances</h2>
        <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
          <h3 slot="headline" className="vads-u-font-size--h3">
            {alertInfo.header}
          </h3>
          {alertInfo.secondBody}
        </va-alert>
      </>
    );
  }
  return <></>;
};

const OverviewPage = () => {
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );

  // feature toggle stuff for VHA payment history MVP
  const { useToggleLoadingValue } = useFeatureToggle();
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  // value of specific toggle
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  const {
    debts,
    isError: debtError,
    isPending: isDebtPending,
    isProfileUpdating,
  } = debtLetters;
  const debtLoading = isDebtPending || isProfileUpdating;
  const { statements, error: mcpError, pending: mcpLoading } = mcp;
  const statementsEmpty = statements?.length === 0;
  const sortedStatements = shouldShowVHAPaymentHistory
    ? mcp.statements.data ?? []
    : sortStatementsByDate(statements || []);
  const statementsByUniqueFacility = shouldShowVHAPaymentHistory
    ? uniqBy(mcp.statements.data, 'facilityId')
    : uniqBy(sortedStatements, 'pSFacilityNum');
  const title = 'Copay balances';
  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  const MAX_ROWS = 10;
  const ITEM_TYPE = 'copays';

  function paginate(array, pageSize, pageNumber) {
    return array?.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  function getPaginationText(
    currentPage,
    pageSize,
    totalItems,
    label = ITEM_TYPE,
  ) {
    // Only display pagination text when there are more than MAX_ROWS total items
    if (totalItems <= MAX_ROWS) {
      return '';
    }

    const startItemIndex = (currentPage - 1) * pageSize + 1;
    const endItemIndex = Math.min(currentPage * pageSize, totalItems);

    return `Showing ${startItemIndex}-${endItemIndex} of ${totalItems} ${label}`;
  }

  const [currentData, setCurrentData] = useState(
    paginate(statementsByUniqueFacility, MAX_ROWS, 1),
  );
  const [currentPage, setCurrentPage] = useState(1);

  function onPageChange(page) {
    setCurrentData(paginate(statementsByUniqueFacility, MAX_ROWS, page));
    setCurrentPage(page);
  }

  const numPages = Math.ceil(statementsByUniqueFacility.length / MAX_ROWS);

  const renderVaPagination = () => {
    if (statementsByUniqueFacility.length > MAX_ROWS) {
      return (
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
          pages={numPages}
        />
      );
    }
    return null;
  };

  if (debtLoading || mcpLoading || togglesLoading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  }
  const isNotEnrolledInHealthCare = mcpError?.status === '403';
  const renderContent = () => {
    if (isNotEnrolledInHealthCare) {
      return <CopayAlertContainer type="no-health-care" />;
    }
    if (mcpError) {
      return renderAlert(
        debtError ? ALERT_TYPES.ALL_ERROR : ALERT_TYPES.ERROR,
        debts?.length,
      );
    }
    if (statementsEmpty) {
      return renderAlert(ALERT_TYPES.ZERO, debts?.length);
    }

    return (
      <article className="vads-u-padding-x--0 vads-u-padding-bottom--0">
        <Balances
          statements={currentData}
          showVHAPaymentHistory={shouldShowVHAPaymentHistory}
          paginationText={getPaginationText(
            currentPage,
            MAX_ROWS,
            statementsByUniqueFacility.length,
            ITEM_TYPE,
          )}
        />
        {renderVaPagination()}
        {renderOtherVA(debts?.length, debtError)}
        <NeedHelpCopay />
      </article>
    );
  };

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Overpayments and copay bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Copay balances',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="summary-page-title">{title}</h1>
        <p className="va-introtext">
          Check the balance of VA health care and prescription charges from each
          of your facilities. Find out how to make payments or request financial
          help.
        </p>
        {renderContent()}
      </div>
    </>
  );
};

export default OverviewPage;
