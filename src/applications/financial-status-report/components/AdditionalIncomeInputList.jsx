import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isValidateCurrency } from '../utils/validations';

const AdditionalIncomeInputList = () => {
  // const { formContext } = props;

  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState([]);
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

  const onBlur = ({ target }) => {
    return isValidateCurrency(target.value)
      ? setErrorList([...errorList.filter(a => a !== target.name)])
      : setErrorList([...errorList, target.name]);
  };

  return (
    <div>
      <legend className="schemaform-block-title">Your other income</legend>
      <p>How much is your monthly income for each income source?</p>
      {addlIncRecords?.map((income, key) => (
        <div key={income.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={income.name}
            name={income.name}
            value={`$ ${income.amount}`}
            id={income.name + key}
            error={
              errorList.includes(income.name) ? 'Enter valid dollar amount' : ''
            }
            inputmode="decimal"
            onInput={onChange}
            onBlur={onBlur}
            required
          />
        </div>
      ))}
    </div>
  );
};

export default AdditionalIncomeInputList;
