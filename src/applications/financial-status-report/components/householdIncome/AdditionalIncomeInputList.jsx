import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const AdditionalIncomeInputList = ({ errorSchema, formContext }) => {
  const errorList = errorSchema?.addlIncRecords?.__errors;
  const { submitted } = formContext;

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

  const title = 'Your other income';
  const prompt = 'How much is your monthly income for each income source?';

  return (
    <InputList
      errorList={errorList}
      inputs={addlIncRecords}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.ADDITIONAL_INCOME_MIN}
      max={VALIDATION_LIMITS.ADDITIONAL_INCOME_MAX}
    />
  );
};

AdditionalIncomeInputList.propTypes = {
  errorSchema: PropTypes.shape({
    addlIncRecords: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default AdditionalIncomeInputList;
