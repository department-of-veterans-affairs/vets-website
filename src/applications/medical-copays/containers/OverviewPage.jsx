import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import FacilityContacts from '../components/FacilityContacts';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Alert from '../components/Alerts';
import { sortStatementsByDate, rmvDupFacilities } from '../utils/helpers';

const OverviewPage = () => {
  const statementData = useSelector(({ mcp }) => mcp.statements);
  const facilities = rmvDupFacilities(statementData);
  const sortedStatements = sortStatementsByDate(statementData);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');
  const error = useSelector(({ mcp }) => mcp.error);
  const [alertType, setAlertType] = useState(null);

  useEffect(
    () => {
      scrollToTop();
      setAlertType(null);
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
      <h1 data-testid="overview-page-title">Your current copay balances</h1>
      {alertType ? (
        <Alert type={alertType} error={error} />
      ) : (
        <>
          <p className="vads-u-font-size--lg">
            Check your VA health care and prescription charges from each of your
            facilities. Find out how to make payments or request financial help.
          </p>
          <Balances statementData={statementsByUniqueFacility} />
          <BalanceQuestions />
          <FacilityContacts facilities={facilities} />
        </>
      )}
    </>
  );
};

export default OverviewPage;
