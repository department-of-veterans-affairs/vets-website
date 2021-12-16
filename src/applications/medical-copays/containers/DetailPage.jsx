import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PDFStatementList from '../components/PDFStatementList';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { Link } from 'react-router-dom';
import Modals from '../components/Modals';
import Alert from '../components/Alerts';
import { OnThisPage } from '../components/OnThisPage';
import { formatDate } from '../utils/helpers';

const DetailPage = ({ match }) => {
  const selectedId = match.params.id;
  const error = useSelector(({ mcp }) => mcp.error);
  const statementData = useSelector(({ mcp }) => mcp.statements);
  const [selectedCopay] = statementData?.filter(({ id }) => id === selectedId);
  const [alertType, setAlertType] = useState(null);

  useEffect(
    () => {
      scrollToTop();
      setAlertType(null);
      if (error) {
        setAlertType('error');
      }
    },
    [error],
  );

  return (
    <>
      <h1 className="vads-u-margin-bottom--1" data-testid="detail-page-title">
        Your copay bill for {selectedCopay?.station.facilityName}
      </h1>

      {alertType ? (
        <Alert type={alertType} error={error} />
      ) : (
        <>
          <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
            Updated on
            <span className="vads-u-margin-x--0p5" data-testid="updated-date">
              {formatDate(selectedCopay?.pSStatementDate)}
            </span>
          </p>

          <Alert
            type={selectedCopay?.pHAmtDue === 0 ? 'zero-balance' : 'status'}
            copay={selectedCopay}
          />

          <OnThisPage />

          <PDFStatementList />

          <HowToPay
            acctNum={selectedCopay?.pHAccountNumber}
            facility={selectedCopay?.station}
          />

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
      )}
    </>
  );
};

export default DetailPage;
