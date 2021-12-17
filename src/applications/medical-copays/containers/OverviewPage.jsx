import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import FacilityContacts from '../components/FacilityContacts';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import { sortStatementsByDate, rmvDupFacilities } from '../utils/helpers';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

const OverviewPage = () => {
  const statements = useSelector(({ mcp }) => mcp.statements) ?? [];
  const facilities = rmvDupFacilities(statements);
  const sortedStatements = sortStatementsByDate(statements);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <h1 data-testid="overview-page-title">Your current copay balances</h1>
      <p className="vads-u-font-size--lg">
        Check your VA health care and prescription charges from each of your
        facilities. Find out how to make payments or request financial help.
      </p>
      <Balances statements={statementsByUniqueFacility} />
      <BalanceQuestions />
      <FacilityContacts facilities={facilities} />
    </>
  );
};

export default OverviewPage;
