import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isValidateCurrency } from '../utils/validations';

const AdditionalIncomeInputList = () => {
  // const { formContext } = props;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    additionalIncome: { addlIncRecords },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        additionalIncome: {
          ...data.additionalIncome,
          addlIncRecords: addlIncRecords.map(income => {
            if (income.name === target.name) {
              return {
                ...income,
                amount: target.value,
              };
            }
            return income;
          }),
        },
      }),
    );
  };

  const errorList = new Set();

  const onBlur = ({ target }) => {
    return isValidateCurrency(target.value)
      ? errorList.add(target.id)
      : errorList.delete(target.value);
  };

  return (
    <div>
      <legend className="schemaform-block-title">Your other income</legend>
      <p>How much is your monthly income for each income source?</p>
      {addlIncRecords?.map((income, key) => (
        <div
          key={income.name + key}
          className={`currency-input vads-u-width--auto ${
            errorList.has(income.name + key) ? 'error-line' : ''
          }`}
        >
          <label htmlFor={income + key}>
            {income.name}
            <p className="vads-u-color--secondary-dark vads-u-margin--0">
              (*Required)
            </p>
          </label>
          <input
            className="input-size-3"
            type="string"
            id={income.name + key}
            name={income.name}
            value={income.amount}
            onChange={onChange}
            onBlur={onBlur}
            label={income.name}
            required="true"
            min="0"
          />
        </div>
      ))}
    </div>
  );
};

export default AdditionalIncomeInputList;
