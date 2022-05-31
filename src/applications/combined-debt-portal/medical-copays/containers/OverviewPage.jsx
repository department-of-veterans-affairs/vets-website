import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import {
  sortStatementsByDate,
  cdpAccessToggle,
  ALERT_TYPES,
  APP_TYPES,
  API_RESPONSES,
} from '../../combined/utils/helpers';
import OtherVADebts from '../../combined/components/OtherVADebts';
import alertMessage from '../../combined/utils/alert-messages';
import { fetchDebtResponseAsync } from './MedicalCopaysApp';

const OverviewPage = () => {
  const [hasDebts, setHasDebts] = useState(false);

  const showCDPComponents = useSelector(state => cdpAccessToggle(state));
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const sortedStatements = sortStatementsByDate(statements);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');
  const title = 'Current copay bills';

  const renderOtherVA = () => {
    const alertInfo = alertMessage(ALERT_TYPES.ERROR, APP_TYPES.DEBT);
    if (hasDebts > 0) {
      return <OtherVADebts module={APP_TYPES.DEBT} />;
    }
    if (hasDebts === API_RESPONSES.ERROR) {
      return (
        <>
          <h3>Your other VA debts</h3>
          <va-alert
            data-testid={alertInfo.testID}
            status={alertInfo.alertStatus}
          >
            <h4 slot="headline" className="vads-u-font-size--h3">
              {alertInfo.header}
            </h4>
            {alertInfo.body}
          </va-alert>
        </>
      );
    }
    return <></>;
  };

  useEffect(() => {
    scrollToTop();
    fetchDebtResponseAsync().then(hasDebtsResponse =>
      setHasDebts(hasDebtsResponse),
    );
  }, []);

  return (
    <>
      <va-breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/manage-debt-and-bills">Manage your VA debt and bills</a>
        <a href="/manage-debt-and-bills/summary/">
          Your debt and bills summary
        </a>
        <a href="/manage-debt-and-bills/summary/copay-balances">
          {' '}
          Current copay bills
        </a>
      </va-breadcrumbs>
      <h1 data-testid="overview-page-title">{title}</h1>
      <p className="vads-u-font-size--lg vads-u-font-family--serif">
        Check the balance of VA health care and prescription charges from each
        of your facilities. Find out how to make payments or request financial
        help.
      </p>
      <Balances statements={statementsByUniqueFacility} />
      {showCDPComponents && renderOtherVA()}
      <BalanceQuestions />
    </>
  );
};

export default OverviewPage;
