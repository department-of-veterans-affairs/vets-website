import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import FacilityContacts from '../components/FacilityContacts';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Alert from '../components/Alerts';

const OverviewPage = () => {
  const statementData = useSelector(({ mcp }) => mcp.statements);
  const error = useSelector(({ mcp }) => mcp.error);
  const [alertType, setAlertType] = useState(null);

  // remove duplicate facilities with matching facility numbers
  const facilities = statementData
    .map(({ station }) => station)
    .filter(
      (val, index, arr) =>
        arr.findIndex(temp => temp.facilitYNum === val.facilitYNum) === index,
    );

  useEffect(
    () => {
      scrollToTop();
      if (!statementData?.length) {
        setAlertType('no-history');
      }
      if (error) {
        setAlertType('error');
      }
    },
    [error, statementData],
  );

  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/health-care">Health care</a>
        <a href="/health-care/pay-copay-bill">Pay your VA copay bill</a>
        <a href="/health-care/pay-copay-bill/your-current-balances">
          Your current copay balances
        </a>
      </Breadcrumbs>
      <h1>Your current copay balances</h1>
      {alertType ? (
        <Alert type={alertType} />
      ) : (
        <>
          <p className="vads-u-font-size--lg">
            Check your VA health care and prescription charges from each of your
            facilities. Find out how to make payments or request financial help.
          </p>
          <Balances statementData={statementData} />
          <BalanceQuestions />
          <FacilityContacts facilities={facilities} />
        </>
      )}
    </>
  );
};

export default OverviewPage;
