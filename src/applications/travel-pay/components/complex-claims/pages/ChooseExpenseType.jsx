import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
  VaRadio,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { EXPENSE_TYPES } from '../../../constants';

const ChooseExpenseType = () => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [showError, setShowError] = useState(false);

  // Convert EXPENSE_TYPES object into an array for mapping
  const expenseOptions = Object.values(EXPENSE_TYPES);

  const handleContinue = () => {
    // TODO: Handle error case for existing mileage expense
    // if (selectedExpenseType === 'mileage' && hasExistingMileage) {
    //   setShowError(true);
    //   return;
    // }

    if (!selectedExpenseType) {
      setShowError(true);
      return;
    }

    setShowError(false);
    // Navigate to the route defined in the constant
    const selectedExpense = expenseOptions.find(
      e => e.route === selectedExpenseType,
    );

    if (selectedExpense) {
      navigate(`/file-new-claim/${apptId}/${claimId}/${selectedExpense.route}`);
    }
  };

  const handleBack = () => {
    navigate(`/file-new-claim/${apptId}`);
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--2">
        What type of expense do you want to add?
      </h1>
      <p>Start with one expense. You’ll be able to add other expenses later.</p>
      <p className="vads-u-margin-bottom--0">
        To request reimbursement for airfare, lodging, and meals, you’ll need a
        pre-approval letter.
      </p>
      <VaRadio
        label="Choose an expense type"
        required
        class="vads-u-margin-top--0"
        error={showError ? 'Please select an expense type' : null}
        onVaValueChange={event => {
          setSelectedExpenseType(event.detail.value);
          if (showError) setShowError(false);
        }}
      >
        {expenseOptions.map(option => (
          <va-radio-option
            tile
            key={option.route}
            label={option.title}
            value={option.route}
            checked={selectedExpenseType === option.route}
          />
        ))}
      </VaRadio>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        disable-analytics
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
      />
    </>
  );
};

export default ChooseExpenseType;
