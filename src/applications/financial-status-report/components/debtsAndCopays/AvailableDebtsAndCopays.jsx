import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import Scroll from 'react-scroll';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchDebts } from '../../actions';
import { getStatements } from '../../actions/copays';
import DebtCheckBox from './DebtCheckBox';
import CopayCheckBox from './CopayCheckBox';
import { sortStatementsByDate } from '../../utils/helpers';
import { setFocus } from '../../utils/fileValidation';

import ComboAlerts from '../alerts/ComboAlerts';
import AlertCard from '../alerts/AlertCard';
import { ALERT_TYPES, DEBT_TYPES } from '../../constants';
import { isEligibleForStreamlined } from '../../utils/streamlinedDepends';

const { scroller } = Scroll;
const scrollToTop = () => {
  scroller.scrollTo('error-message-content', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const AvailableDebtsAndCopays = ({ formContext }) => {
  const {
    debts,
    statements,
    pending,
    debtError = false,
    pendingCopays,
    copayError = false,
  } = useSelector(state => state.fsr);
  // const { debts, statements, pending, isError, pendingCopays } = useSelector(
  //   state => state.fsr,
  // );
  const { data } = useSelector(state => state.form);
  const dispatch = useDispatch();

  // copays
  const sortedStatements = sortStatementsByDate(statements ?? []);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');

  const [selectionError, setSelectionError] = useState(false);
  useEffect(
    () => {
      setSelectionError(
        formContext.submitted && !data.selectedDebtsAndCopays?.length,
      );

      const eligible = isEligibleForStreamlined(data);
      if (eligible !== data?.gmtData?.isEligibleForStreamlined) {
        dispatch(
          setData({
            ...data,
            gmtData: {
              ...data.gmtData,
              isEligibleForStreamlined: eligible,
            },
          }),
        );
      }
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

  useEffect(
    () => {
      fetchDebts(dispatch);
      getStatements(dispatch);
    },
    [dispatch],
  );

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
  const debtZero = !debts.length;
  const copayZero = !statementsByUniqueFacility.length;

  const bothErr = debtError && copayError;
  const bothZero = debtZero && copayZero && !debtError && !copayError;

  // cobmined error and empty state combos:
  if (bothErr || bothZero) {
    return (
      <ComboAlerts alertType={bothErr ? ALERT_TYPES.ERROR : ALERT_TYPES.ZERO} />
    );
  }

  // special case, one errors and one is empty
  // nothing to actually display so we short circuit and return just the error (no question info)
  if ((debtError && copayZero) || (copayError && debtZero)) {
    return (
      <AlertCard debtType={debtError ? DEBT_TYPES.DEBT : DEBT_TYPES.COPAY} />
    );
  }

  return (
    <div data-testid="debt-selection-content">
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
      {(debtError || copayError) && (
        <AlertCard debtType={debtError ? DEBT_TYPES.DEBT : DEBT_TYPES.COPAY} />
      )}
      <va-additional-info trigger="What if my debt isn’t listed here?" uswds>
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact="8008270648" /> (or{' '}
        <va-telephone contact="6127136415" international /> from overseas).
        We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </va-additional-info>
    </div>
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
