import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { apiRequest } from 'platform/utilities/api';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import { sortStatementsByDate, cdpAccessToggle } from '../utils/helpers';
import OtherVADebts from '../components/OtherVADebts';
import environment from '~/platform/utilities/environment';
import { debtMockResponse } from '../../debt-letters/utils/mockResponses';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';

let hasDebts = false;

const fetchDebtResponseAsync = async () => {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  };
  const approvedDeductionCodes = Object.keys(deductionCodes);

  const response = isVAProfileServiceConfigured()
    ? await apiRequest(`${environment.API_URL}/v0/debts`, options)
    : await debtMockResponse();

  hasDebts = response.debts.length > 0;

  return response.debts
    .filter(res => approvedDeductionCodes.includes(res.deductionCode))
    .filter(debt => debt.currentAr > 0);
};

const OverviewPage = () => {
  const showCDPComponents = useSelector(state => cdpAccessToggle(state));
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const sortedStatements = sortStatementsByDate(statements);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');
  const title = 'Current copay balances';
  fetchDebtResponseAsync();

  // useEffect(
  //   () => {
  //     console.log('HasDebts: ', hasDebts); // attempting to trigger rerender because prevailing thought is render is happening while false and not updating page
  //   },
  //   [hasDebts],
  // );

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">{title}</a>
      </Breadcrumbs>
      <h1 data-testid="overview-page-title">{title}</h1>
      <p className="vads-u-font-size--lg vads-u-font-family--serif">
        Check the balance of VA health care and prescription charges from each
        of your facilities. Find out how to make payments or request financial
        help.
      </p>
      <Balances statements={statementsByUniqueFacility} />
      {showCDPComponents && hasDebts && <OtherVADebts module="MCP" />}
      <BalanceQuestions />
    </>
  );
};

export default OverviewPage;
