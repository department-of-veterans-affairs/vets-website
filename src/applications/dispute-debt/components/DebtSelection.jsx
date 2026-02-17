import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import i18nDebtApp from 'applications/dispute-debt/i18n';
import { setFocus } from '../utils';

import AlertCard from './AlertCard';
import { DEBT_TYPES } from '../constants';
import ZeroDebtsAlert from './ZeroDebtsAlert';

const selectCategorizedDebts = createSelector(
  [state => state.availableDebts],
  availableDebtsState => {
    const { availableDebts = [], isDebtError = false } =
      availableDebtsState || {};

    return {
      isDebtError,
      availableDebts: availableDebts.filter(debt => !debt.submitted),
      submittedDebts: availableDebts.filter(debt => debt.submitted),
    };
  },
);

const DebtSelection = ({ formContext }) => {
  const { availableDebts, isDebtError, submittedDebts } = useSelector(
    selectCategorizedDebts,
  );

  const { data } = useSelector(state => state.form);
  const { selectedDebts = [] } = data;
  const dispatch = useDispatch();

  const [selectionError, setSelectionError] = useState(null);

  useEffect(() => {
    if (formContext.submitted && !selectedDebts?.length) {
      setSelectionError('Choose at least one debt');
      setFocus('va-checkbox-group');
      return;
    }
    setSelectionError(null);
  }, [dispatch, formContext.submitted, selectedDebts?.length]);

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

  // nothing to actually display so we short circuit and return just the error (no question info)
  if (isDebtError) {
    return <AlertCard debtType={DEBT_TYPES.DEBT} />;
  }

  // if no debts are available, we show a zero debts alert
  if (availableDebts.length === 0) {
    return <ZeroDebtsAlert />;
  }

  const availableDebtCheckbox = debt => (
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
      tile
    />
  );

  const submittedDebtsCard = debt => {
    const formattedDate = new Date(debt.submissionDate).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    return (
      <va-card
        data-testid={`debt-submitt4ed-${debt.compositeDebtId}`}
        key={debt.compositeDebtId}
        background
      >
        <div>
          <h4 className="vads-u-margin-top--0 vads-u-font-family--sans">
            {debt.label}
          </h4>
          <p className="vads-u-margin-y--0">
            {i18nDebtApp.t('debt-selection.submitted-note', {
              date: formattedDate,
            })}
          </p>
        </div>
      </va-card>
    );
  };

  return (
    <div data-testid="debt-selection-content">
      <VaCheckboxGroup
        className="vads-u-margin-y--3 debt-selection-checkbox-group"
        error={selectionError}
        id="debt-selection-checkbox-group"
        label="Select at least one debt to dispute: "
        onVaChange={onGroupChange}
        required
      >
        {availableDebts.map(debt => availableDebtCheckbox(debt))}
        {submittedDebts.map(debt => submittedDebtsCard(debt))}
      </VaCheckboxGroup>
      <va-additional-info trigger="If your debt isn't listed here">
        <p>
          To dispute a benefit overpayment debt that’s not listed here, call us
          at <va-telephone contact={CONTACTS.DMC} /> (or{' '}
          <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
          overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
          ET.
        </p>
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
