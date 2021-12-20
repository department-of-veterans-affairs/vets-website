import React, { useEffect } from 'react';
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
import { formatDate } from '../utils/helpers';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const [selectedCopay] = statements?.filter(({ id }) => id === selectedId);
  const statementDate = formatDate(selectedCopay?.pSStatementDate);
  const acctNum = selectedCopay?.pHAccountNumber
    ? selectedCopay?.pHAccountNumber
    : selectedCopay?.pHCernerAccountNumber;

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <h1 className="vads-u-margin-bottom--1" data-testid="detail-page-title">
        Your copay bill for {selectedCopay?.station.facilityName}
      </h1>

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

      <Alert
        type={selectedCopay?.pHAmtDue === 0 ? 'zero-balance' : 'status'}
        copay={selectedCopay}
      />

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
