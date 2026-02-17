import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import { uniqBy, head } from 'lodash';
import { isValid } from 'date-fns';
import { setData } from 'platform/forms-system/src/js/actions';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatDateShort } from 'platform/utilities/date';
import { setFocus } from '../../utils/fileValidation';

import { sortStatementsByDate, currency, endDate } from '../../utils/helpers';
import { deductionCodes } from '../../constants/deduction-codes';

import ComboAlerts from '../alerts/ComboAlerts';
import AlertCard from '../alerts/AlertCard';
import { ALERT_TYPES, DEBT_TYPES } from '../../constants';
import { isEligibleForStreamlined } from '../../utils/streamlinedDepends';

const AvailableDebtsAndCopays = ({ formContext }) => {
  const {
    debts,
    statements,
    pending,
    debtError = false,
    pendingCopays,
    copayError = false,
  } = useSelector(state => state.fsr);
  const { data } = useSelector(state => state.form);
  const { selectedDebtsAndCopays = [] } = data;
  const dispatch = useDispatch();

  // copays
  const sortedStatements = sortStatementsByDate(statements ?? []);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');

  const [selectionError, setSelectionError] = useState(null);
  useEffect(
    () => {
      if (formContext.submitted && !data.selectedDebtsAndCopays?.length) {
        setSelectionError('Choose at least one debt');
        setFocus('va-checkbox-group');
        return;
      }
      setSelectionError(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, formContext.submitted, selectedDebtsAndCopays?.length],
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

  const onGroupChange = ({ detail, target }) => {
    // adding new prop selectedDebtId to selectedDebtsAndCopays so it's easier to filter on uncheck
    if (detail.checked) {
      // debts and copays use different unique identifier props, so we need to check the data-debt-type to pull the correct one
      let selectedDebt;
      if (target.dataset.debtType === DEBT_TYPES.DEBT) {
        selectedDebt = debts.find(
          debt => debt.compositeDebtId === target.dataset.index,
        );
      } else {
        selectedDebt = statementsByUniqueFacility.find(
          copay => copay.id === target.dataset.index,
        );
      }

      // including new selectedDebtId prop
      const newlySelectedDebtsAndCopays = [
        ...selectedDebtsAndCopays,
        { ...selectedDebt, selectedDebtId: target.dataset.index },
      ];

      return dispatch(
        setData({
          ...data,
          selectedDebtsAndCopays: newlySelectedDebtsAndCopays,
        }),
      );
    }

    // uncheck by new selectedDebtId prop
    const combinedChecked = selectedDebtsAndCopays?.filter(
      selection => selection.selectedDebtId !== target.dataset.index,
    );

    return dispatch(
      setData({
        ...data,
        selectedDebtsAndCopays: combinedChecked,
      }),
    );
  };

  // helper functions to get debt and copay labels and descriptions
  const getDebtLabel = debt =>
    `${currency(debt?.currentAr)} ${deductionCodes[debt.deductionCode] ||
      debt.benefitType}`;

  const getDebtDescription = debt => {
    // most recent debt history entry
    const dates = debt?.debtHistory?.map(m => new Date(m.date)) ?? [];
    const sortedHistory = dates.sort((a, b) => Date.parse(b) - Date.parse(a));
    const mostRecentDate = isValid(head(sortedHistory))
      ? formatDateShort(head(sortedHistory))
      : '';
    const dateby = endDate(mostRecentDate, 30);
    return dateby ? `Pay or request help by ${dateby}` : '';
  };

  const getCopayLabel = copay =>
    `${currency(copay?.pHAmtDue)} copay bill for ${copay.station.facilityName ||
      getMedicalCenterNameByID(copay.station.facilitYNum)}`;

  const getCopayDescription = copay =>
    `Pay or request help by ${endDate(copay.pSStatementDateOutput, 30)}`;

  return (
    <div data-testid="debt-selection-content">
      <VaCheckboxGroup
        className="vads-u-margin-y--3 debt-selection-checkbox-group"
        error={selectionError}
        id="debt-selection-checkbox-group"
        label="Select one or more debts you want to request relief for: "
        onVaChange={onGroupChange}
        required
      >
        {debts.map(debt => (
          <va-checkbox
            checked={selectedDebtsAndCopays?.some(
              currDebt => currDebt.selectedDebtId === debt.compositeDebtId,
            )}
            checkbox-description={getDebtDescription(debt)}
            data-debt-type={DEBT_TYPES.DEBT}
            data-index={debt.compositeDebtId}
            data-testid="debt-selection-checkbox"
            key={debt.compositeDebtId}
            label={getDebtLabel(debt)}
            tile
          />
        ))}
        {statementsByUniqueFacility.map(copay => (
          <va-checkbox
            checked={selectedDebtsAndCopays?.some(
              currCopay => currCopay.selectedDebtId === copay.id,
            )}
            checkbox-description={getCopayDescription(copay)}
            data-debt-type={DEBT_TYPES.COPAY}
            data-index={copay.id}
            data-testid="copay-selection-checkbox"
            key={copay.id}
            label={getCopayLabel(copay)}
            tile
          />
        ))}
      </VaCheckboxGroup>
      {(debtError || copayError) && (
        <AlertCard debtType={debtError ? DEBT_TYPES.DEBT : DEBT_TYPES.COPAY} />
      )}
      <va-additional-info trigger="What if my debt isn’t listed here?">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact={CONTACTS.DMC} /> (or{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
        overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
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
};

export default AvailableDebtsAndCopays;
