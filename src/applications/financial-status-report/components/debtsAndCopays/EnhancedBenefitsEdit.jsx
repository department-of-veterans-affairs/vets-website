import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ButtonGroup from '../shared/ButtonGroup';

export const ERROR_MESSAGES = {
  EMPTY_VALUE: 'Please enter amount received last month',
  INVALID_VALUE: 'Please enter a valid dollar amount',
};
export const RETURN_PATH = '/your-benefits';

const EnhancedBenefitsEdit = ({ goToPath }) => {
  const benefitType = new URLSearchParams(window.location.search).get('type');
  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const incomeArray = useMemo(() => data?.income || [], [data]);
  const veteranIncome = useMemo(
    () =>
      incomeArray.find(income => income.veteranOrSpouse === 'VETERAN') || {},
    [incomeArray],
  );

  const [error, setError] = useState(null);

  const [initialValue, setInitialValue] = useState(
    veteranIncome[benefitType] || '',
  );
  const [inputValue, setInputValue] = useState(initialValue);

  const validateNumber = value => {
    const pattern = /^\d+[.]?\d{0,2}$/;
    return pattern.test(value);
  };

  const handleChange = event => {
    const { value } = event.target;
    setInputValue(value);

    if (!value) {
      setError(ERROR_MESSAGES.EMPTY_VALUE);
    } else if (!validateNumber(value)) {
      setError(ERROR_MESSAGES.INVALID_VALUE);
    } else {
      setError(null);
    }
  };

  const onCancel = () => {
    setInputValue(initialValue);
    goToPath(RETURN_PATH);
  };

  const onUpdate = () => {
    if (error) return;
    const updatedIncomeArray = incomeArray.map(
      income =>
        income.veteranOrSpouse === 'VETERAN'
          ? {
              ...income,
              [benefitType]: inputValue,
            }
          : income,
    );

    dispatch(
      setData({
        ...data,
        income: updatedIncomeArray,
      }),
    );
    setInitialValue(inputValue);
    goToPath(RETURN_PATH);
  };

  const titleLookup = {
    compensationAndPension: 'Edit Disability compensation and pension benefits',
    education: 'Edit Education benefits',
  };
  const title = titleLookup[benefitType] || 'Edit Other benefits';
  const prompt = 'Amount received last month?';

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title" id="root__title">
          Your VA benefits
        </legend>
        <div className="vads-u-padding-top--1p5">
          <p>
            <b>Note:</b> Any updates you make here will only update your
            information for this request.
          </p>
        </div>
        <h3>{title}</h3>
        <VaNumberInput
          label={prompt}
          error={error}
          id={`${benefitType}-benefitAmount`}
          name={benefitType}
          onInput={handleChange}
          value={inputValue}
          className="no-wrap input-size-2"
          required
          uswds
        />
      </fieldset>
      <ButtonGroup
        buttons={[
          {
            label: 'Cancel',
            onClick: onCancel,
            secondary: true,
          },
          {
            label: 'Update',
            onClick: onUpdate,
          },
        ]}
      />
    </form>
  );
};

EnhancedBenefitsEdit.propTypes = {
  goToPath: PropTypes.func.isRequired,
};

export default EnhancedBenefitsEdit;
