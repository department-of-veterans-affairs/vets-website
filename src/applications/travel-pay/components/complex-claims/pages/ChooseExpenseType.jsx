import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
  VaRadio,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ChooseExpenseType = () => {
  const navigate = useNavigate();
  const { apptId } = useParams();
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [showError, setShowError] = useState(false);

  const expenseOptions = [
    { value: 'mileage', label: 'Mileage' },
    { value: 'parking', label: 'Parking' },
    { value: 'tolls', label: 'Tolls' },
    {
      value: 'public-transportation',
      label: 'Public transportation, taxi, or rideshare',
    },
    { value: 'air-fare', label: 'Air fare' },
    { value: 'lodging', label: 'Lodging' },
    { value: 'meals', label: 'Meals' },
    { value: 'other', label: 'Other travel expenses' },
  ];

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
    if (selectedExpenseType === 'mileage') {
      navigate(`/file-new-claim/complex/${apptId}/mileage`);
    } else {
      // For other expense types, navigate to appropriate pages when they're created
      // TODO: Add navigation for other expense types
    }
  };

  const handleBack = () => {
    navigate(`/file-new-claim/complex/${apptId}`);
  };

  return (
    <>
      <h1 className="vads-u-margin-bottom--2">
        What type of expense do you want to add?
      </h1>
      <p>Start with one expense. You’ll be able to add other expenses later.</p>
      <p className="vads-u-margin-bottom--0">
        To request reimbursement for air fare, lodging, and meals, you’ll need a
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
            key={option.value}
            label={option.label}
            value={option.value}
            checked={selectedExpenseType === option.value}
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
