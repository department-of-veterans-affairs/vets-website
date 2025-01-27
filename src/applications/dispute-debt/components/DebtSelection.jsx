import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setFocus } from '../utils';

import AlertCard from './AlertCard';
import { DEBT_TYPES } from '../constants';

const DebtSelection = ({ formContext }) => {
  const { availableDebts, isDebtError } = useSelector(
    state => state.availableDebts,
  );
  const { data } = useSelector(state => state.form);
  const { selectedDebts = [] } = data;
  const dispatch = useDispatch();

  const [selectionError, setSelectionError] = useState(null);

  useEffect(
    () => {
      if (formContext.submitted && !selectedDebts?.length) {
        setSelectionError('Choose at least one debt');
        setFocus('va-checkbox-group');
        return;
      }
      setSelectionError(null);
    },
    [dispatch, formContext.submitted, selectedDebts?.length],
  );

  // nothing to actually display so we short circuit and return just the error (no question info)
  if (isDebtError || !availableDebts.length) {
    return <AlertCard debtType={DEBT_TYPES.DEBT} />;
  }

  const onGroupChange = ({ detail, target }) => {
    // adding new prop selectedDebtId to selectedDebts so it's easier to filter on uncheck
    if (detail.checked) {
      // debts and copays use different unique identifier props, so we need to check the data-debt-type to pull the correct one
      let selectedDebt;
      if (target.dataset.debtType === DEBT_TYPES.DEBT) {
        selectedDebt = availableDebts.find(
          debt => debt.compositeDebtId === target.dataset.index,
        );
      }

      // including new selectedDebtId prop
      const newlySelectedDebts = [
        ...selectedDebts,
        { ...selectedDebt, selectedDebtId: target.dataset.index },
      ];

      return dispatch(
        setData({
          ...data,
          selectedDebts: newlySelectedDebts,
        }),
      );
    }

    // uncheck by new selectedDebtId prop
    const combinedChecked = selectedDebts?.filter(
      selection => selection.selectedDebtId !== target.dataset.index,
    );

    return dispatch(
      setData({
        ...data,
        selectedDebts: combinedChecked,
      }),
    );
  };

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
        {availableDebts.map(debt => (
          <va-checkbox
            checked={selectedDebts?.some(
              currDebt => currDebt.selectedDebtId === debt.compositeDebtId,
            )}
            checkbox-description={debt.description}
            data-debt-type={DEBT_TYPES.DEBT}
            data-index={debt.compositeDebtId}
            data-testid="debt-selection-checkbox"
            key={debt.compositeDebtId}
            label={debt.label}
          />
        ))}
      </VaCheckboxGroup>
      <va-additional-info trigger="What if my debt isn’t listed here?">
        If you received a letter about a VA benefit debt that isn’t listed here,
        call us at <va-telephone contact="8008270648" /> (or{' '}
        <va-telephone contact="6127136415" international /> from overseas).
        We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </va-additional-info>
    </div>
  );
};

DebtSelection.propTypes = {
  availableDebts: PropTypes.array,
  data: PropTypes.shape({
    selectedDebts: PropTypes.array,
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  isDebtError: PropTypes.bool,
};

export default DebtSelection;
