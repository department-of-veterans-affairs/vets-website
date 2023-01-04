import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import Scroll from 'react-scroll';
import { ErrorAlert } from './Alerts';
import { fetchDebts } from '../actions';
import { getStatements } from '../actions/copays';
import DebtCheckBox from './DebtCheckBox';
import CopayCheckBox from './CopayCheckBox';
import { sortStatementsByDate } from '../utils/helpers';
import { setFocus } from '../utils/fileValidation';

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

const { scroller } = Scroll;
const scrollToTop = () => {
  scroller.scrollTo('error-message-content', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const AvailableDebtsAndCopays = ({ formContext }) => {
  const { debts, statements, pending, isError, pendingCopays } = useSelector(
    state => state.fsr,
  );
  const { data } = useSelector(state => state.form);

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

  useEffect(
    () => {
      if (selectionError) {
        scrollToTop();
        setFocus('[name="error-message-content"]');
      }
    },
    [selectionError],
  );

  const dispatch = useDispatch();
  useEffect(
    () => {
      fetchDebts(dispatch);
      getStatements(dispatch);
    },
    [dispatch],
  );

  if (isError) return <ErrorAlert />;

  if (pending || pendingCopays) {
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

  if (!debts.length && !statementsByUniqueFacility.length) {
    return <NoDebts />;
  }

  return (
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
            name="error-message-content"
            className="vads-u-font-weight--bold vads-u-color--secondary-dark"
            role="alert"
          >
            <span className="sr-only">Error</span>
            <p>Choose at least one debt</p>
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
  );
};

AvailableDebtsAndCopays.propTypes = {
  debts: PropTypes.array,
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  getDebts: PropTypes.func,
  isError: PropTypes.bool,
  pendingDebts: PropTypes.bool,
};

export default AvailableDebtsAndCopays;
