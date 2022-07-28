import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { uniqBy } from 'lodash';
import { ErrorAlert } from './Alerts';
import { fetchDebts } from '../actions';
import DebtCard from './DebtCard';
import { getStatements } from '../actions/copays';
import DebtCheckBox from './DebtCheckBox';
import CopayCheckBox from './CopayCheckBox';
import { sortStatementsByDate } from '../utils/helpers';

const NoDebts = () => (
  <div className="usa-alert background-color-only">
    <div className="vads-u-margin-bottom--1">
      <h4 className="vads-u-margin--0">You don’t have any VA debt</h4>
    </div>
    <p>
      Our records show you don’t have any debt related to VA benefits. If you
      think this is an error, please contact the Debt Management Center at{' '}
      <va-telephone contact={CONTACTS.DMC} />
    </p>
  </div>
);

const AvailableDebts = () => {
  const { debts, statements, pending, isError, pendingCopays } = useSelector(
    state => state.fsr,
  );

  const isCFSRActive = useSelector(
    state =>
      toggleValues(state)[FEATURE_FLAG_NAMES.combinedFinancialStatusReport],
  );

  // copays
  const sortedStatements = sortStatementsByDate(statements ?? []);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');

  const dispatch = useDispatch();
  useEffect(
    () => {
      fetchDebts(dispatch);
      if (isCFSRActive) {
        getStatements(dispatch);
      }
    },
    [dispatch, isCFSRActive],
  );

  if (isError) return <ErrorAlert />;

  if (pending || (isCFSRActive && pendingCopays)) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Loading your information..."
          set-focus
        />
      </div>
    );
  }

  if (!debts.length && (!isCFSRActive || !statementsByUniqueFacility.length)) {
    return <NoDebts />;
  }

  return isCFSRActive ? (
    <>
      <p className="vads-u-margin-bottom--3">
        Select one or more debts you want to request relief for
      </p>
      {debts.map((debt, index) => (
        <DebtCheckBox debt={debt} key={`${index}-${debt.currentAr}`} />
      ))}
      {statementsByUniqueFacility.map(copay => (
        <CopayCheckBox copay={copay} key={copay.id} />
      ))}
      <va-additional-info trigger="What if my debt isn’t listed here?">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact="800-827-0648" /> (or{' '}
        <va-telephone contact="612-713-6415" international /> from overseas).
        We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </va-additional-info>
    </>
  ) : (
    <>
      <p>
        Select one or more debts below. We’ll help you choose a debt repayment
        or relief option for each.
      </p>
      <p className="vads-u-margin-bottom--3">
        You will be able to choose a repayment option for each debt you select.
      </p>
      {debts.map((debt, index) => (
        <DebtCard debt={debt} key={`${index}-${debt.currentAr}`} />
      ))}
      <h4>What if my debt isn’t listed here?</h4>
      <p className="vads-u-margin-top--2">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact="8008270648" /> (or{' '}
        <va-telephone contact="16127136415" international /> from overseas).
        We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
      <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        If you need help with a VA copay debt,
        <a
          href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/"
          className="vads-u-margin-x--0p5"
        >
          learn how to request financial hardship assistance.
        </a>
      </p>
    </>
  );
};

AvailableDebts.propTypes = {
  debts: PropTypes.array,
  getDebts: PropTypes.func,
  isError: PropTypes.bool,
  pendingDebts: PropTypes.bool,
};

export default AvailableDebts;
