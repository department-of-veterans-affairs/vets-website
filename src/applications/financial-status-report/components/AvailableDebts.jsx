import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';
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

const AvailableDebts = ({ formContext }) => {
  const { debts, statements, pending, isError, pendingCopays } = useSelector(
    state => state.fsr,
  );

  const { data } = useSelector(state => state.form);
  const isCFSRActive = data['view:combinedFinancialStatusReport'];

  // copays
  const sortedStatements = sortStatementsByDate(statements ?? []);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');

  const [selectionError, setSelectionError] = useState(false);
  useEffect(
    () => {
      setSelectionError(
        formContext.submitted && !data.selectedDebtsAndCopays?.length,
      );
    },
    [formContext.submitted, data.selectedDebtsAndCopays?.length],
  );

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
        Select one or more debts you want to request relief for{' '}
        <span className="required-text">(*Required)</span>
      </p>
      <div
        className={
          selectionError
            ? 'error-line vads-u-margin-y--3 vads-u-padding-left--1 vads-u-margin-left--neg1p5'
            : 'vads-u-margin-y--3'
        }
      >
        {selectionError && (
          <span
            className="vads-u-font-weight--bold vads-u-color--secondary-dark"
            role="alert"
          >
            <span className="sr-only">Error</span>
            <p>Select at least one debt you want to request relief for</p>
          </span>
        )}
        {debts.map((debt, index) => (
          <DebtCheckBox debt={debt} key={`${index}-${debt.currentAr}`} />
        ))}
        {statementsByUniqueFacility.map(copay => (
          <CopayCheckBox copay={copay} key={copay.id} />
        ))}
      </div>
      <va-additional-info trigger="What if my debt isn’t listed here?">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact="8008270648" /> (or{' '}
        <va-telephone contact="6127136415" international /> from overseas).
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
        <va-telephone contact="6127136415" international /> from overseas).
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
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  getDebts: PropTypes.func,
  isError: PropTypes.bool,
  pendingDebts: PropTypes.bool,
};

export default AvailableDebts;
