import React, { useState, useEffect, useCallback } from 'react';

const GrossMonthlyIncomeInput = () => {
  const [incomeError, setIncomeError] = useState(false);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState({
    value: '',
    dirty: false,
  });

  const setNewGrossMonthlyIncome = event => {
    setGrossMonthlyIncome({ value: event.target.value, dirty: true });
  };

  const validateGrossMonthlyIncome = useCallback(
    () => {
      const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

      if (
        grossMonthlyIncome.value &&
        (!regex.test(grossMonthlyIncome.value) ||
          Number(grossMonthlyIncome.value) < 0)
      ) {
        setIncomeError(true);
      } else {
        setIncomeError(false);
      }
    },
    [grossMonthlyIncome],
  );

  useEffect(
    () => {
      validateGrossMonthlyIncome();
    },
    [incomeError, grossMonthlyIncome, validateGrossMonthlyIncome],
  );

  return (
    <div className="input">
      <va-text-input
        id="gross-monthly-income"
        name="gross-monthly-income"
        onBlur={setNewGrossMonthlyIncome}
        type="text"
        required
        error={
          incomeError && grossMonthlyIncome.dirty
            ? `Please enter a valid number.`
            : ''
        }
      />
    </div>
  );
};

export default GrossMonthlyIncomeInput;
