import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PDFStatementList from '../components/PDFStatementList';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import { Link } from 'react-router-dom';
import Modals from '../components/Modals';
import Alert from '../components/Alerts';
import { OnThisPage } from '../components/OnThisPage';
import { formatDate, verifyCurrentBalance } from '../utils/helpers';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const [alert, setAlert] = useState('status');
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const title = `Copay bill for ${selectedCopay?.station.facilityName}`;
  const statementDate = formatDate(selectedCopay?.pSStatementDate);
  const isCurrentBalance = verifyCurrentBalance(selectedCopay?.pSStatementDate);
  const acctNum = selectedCopay?.pHAccountNumber
    ? selectedCopay?.pHAccountNumber
    : selectedCopay?.pHCernerAccountNumber;

  useEffect(
    () => {
      if (!isCurrentBalance) {
        setAlert('past-due-balance');
      }
      scrollToTop();
    },
    [isCurrentBalance],
  );

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">
          Current copay balances
        </a>
        <a href="/health-care/pay-copay-bill/your-current-balances/balance-details">
          {title}
        </a>
      </Breadcrumbs>
      <h1 data-testid="detail-page-title">{title}</h1>
      <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
        Updated on
        <time
          dateTime={statementDate}
          className="vads-u-margin-x--0p5"
          data-testid="updated-date"
        >
          {statementDate}
        </time>
      </p>
      <Alert type={alert} copay={selectedCopay} />
      <OnThisPage />
      <PDFStatementList />
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
      <Link className="vads-u-font-size--sm" to="/">
        <i
          className="fa fa-chevron-left vads-u-margin-right--1"
          aria-hidden="true"
        />
        <strong>Return to copay balances</strong>
      </Link>
    </>
  );
};

export default DetailPage;
