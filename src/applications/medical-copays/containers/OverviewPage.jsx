import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import {
  sortStatementsByDate,
  cdpAccessToggle,
  ALERT_TYPES,
  APP_TYPES,
  API_RESPONSES,
} from '../utils/helpers';
import OtherVADebts from '../components/OtherVADebts';
import alertMessage from '../utils/alert-messages';
import { fetchDebtResponseAsync } from './MedicalCopaysApp';

const OverviewPage = () => {
  const [hasDebts, setHasDebts] = useState(false);

  const showCDPComponents = useSelector(state => cdpAccessToggle(state));
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const sortedStatements = sortStatementsByDate(statements);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');
  const title = 'Current copay balances';

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
      <div className="vads-u-font-family--sans no-wrap">
        <VaBreadcrumbs label="Breadcrumb">
          <a href="/">Home</a>
          <a href="/health-care">Health care</a>
          <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
          <a href="/health-care/pay-copay-bill/your-current-balances">
            {title}
          </a>
        </VaBreadcrumbs>
      </div>
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
