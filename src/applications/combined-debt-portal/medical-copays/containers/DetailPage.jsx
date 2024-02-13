import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import HTMLStatementList from '../components/HTMLStatementList';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import Modals from '../components/Modals';
import Alert from '../../combined/components/MCPAlerts';
import { OnThisPageDetails } from '../components/OnThisPageDetails';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
} from '../../combined/utils/helpers';
import '../sass/medical-copays.scss';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const [alert, setAlert] = useState('status');
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const statementDate = formatDate(selectedCopay?.pSStatementDateOutput);
  const isCurrentBalance = verifyCurrentBalance(selectedCopay?.pSStatementDate);
  const acctNum = selectedCopay?.pHAccountNumber
    ? selectedCopay?.pHAccountNumber.toString()
    : selectedCopay?.pHCernerAccountNumber.toString();

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  useEffect(
    () => {
      if (!isCurrentBalance) {
        setAlert('past-due-balance');
      }
    },
    [isCurrentBalance],
  );

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt',
            label: 'Manage your VA debt',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Current copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/detail`,
            label: `Copay bill for ${selectedCopay?.station.facilityName}`,
          },
        ]}
        className="vads-u-font-family--sans no-wrap"
        label="Breadcrumb"
        uswds
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title">{title}</h1>
        <p className="va-introtext">
          Updated on
          <time
            dateTime={statementDate}
            className="vads-u-margin-x--0p5"
            data-testid="updated-date"
          >
            {statementDate}
          </time>
          . Payments after this date will not be reflected here.
        </p>
        <Alert type={alert} copay={selectedCopay} />
        <OnThisPageDetails />
        <HTMLStatementList selectedId={selectedId} />
        <HowToPay acctNum={acctNum} facility={selectedCopay?.station} />
        <FinancialHelp />
        <DisputeCharges />
        <BalanceQuestions
          facilityLocation={selectedCopay?.station.facilityName}
          facilityPhone={selectedCopay?.station.teLNum}
        />
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
      </div>
    </>
  );
};

DetailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default DetailPage;
