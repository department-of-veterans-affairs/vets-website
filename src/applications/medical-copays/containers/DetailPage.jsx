import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import DownloadStatements from '../components/DownloadStatements';
import BalanceQuestions from '../components/BalanceQuestions';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { Link } from 'react-router-dom';
import Modals from '../components/Modals';
import Alert from '../components/Alerts';
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
      if (error) {
        setAlertType('error');
      }
    },
    [error],
  );

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans no-wrap">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">
          Your current copay balances
        </a>
        <a href="/health-care/pay-copay-bill/your-current-balances/balance-details">
          Your copay details
        </a>
      </Breadcrumbs>
      <h1 className="vads-u-margin-bottom--1">
        Your copay bill for {selectedCopay?.station.facilityName}
      </h1>
      {alertType ? (
        <Alert type={alertType} />
      ) : (
        <>
          <p className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--5">
            Updated on
            <span className="vads-u-margin-x--0p5">
              {formatDate(selectedCopay?.pSStatementDate)}
            </span>
          </p>
          <Alert type={'status'} copay={selectedCopay} />
          <va-on-this-page />
          <DownloadStatements />
          <HowToPay acctNum={selectedCopay?.pHCernerAccountNumber} />
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
