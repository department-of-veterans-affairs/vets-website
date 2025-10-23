import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const SpouseAdditionalIncomeInputList = ({ errorSchema, formContext }) => {
  const errorList = errorSchema?.spAddlIncome?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const { spAddlIncome = [] } = data.additionalIncome.spouse;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        additionalIncome: {
          ...data.additionalIncome,
          spouse: {
            spAddlIncome: spAddlIncome.map(income => {
              if (income.name === target.name) {
                return {
                  ...income,
                  amount: target.value,
                };
              }
              return income;
            }),
          },
        },
      }),
    );
  };

  const title = "Your spouse's other income";
  const prompt =
    "How much is your spouse's monthly income for each income source?";

  return (
    <InputList
      errorList={errorList}
      inputs={spAddlIncome}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.SPOUSE_ADDITIONAL_INCOME_MIN}
      max={VALIDATION_LIMITS.SPOUSE_ADDITIONAL_INCOME_MAX}
    />
  );
};

SpouseAdditionalIncomeInputList.propTypes = {
  errorSchema: PropTypes.shape({
    addlIncRecords: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default SpouseAdditionalIncomeInputList;
