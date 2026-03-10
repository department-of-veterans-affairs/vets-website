import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const UtilityBillInputList = props => {
  const { errorSchema, formContext } = props;
  const errorList = errorSchema?.utilityRecords?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const { utilityRecords = [] } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        utilityRecords: utilityRecords.map(utility => {
          if (utility.name === target.name) {
            return {
              ...utility,
              amount: target.value,
            };
          }
          return utility;
        }),
      }),
    );
  };

  const title = 'Your monthly utility bills';
  const prompt = 'How much do you pay for each utility every month?';

  return (
    <InputList
      errorList={errorList}
      inputs={utilityRecords}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.UTILITY_BILL_MIN}
      max={VALIDATION_LIMITS.UTILITY_BILL_MAX}
    />
  );
};

UtilityBillInputList.propTypes = {
  errorSchema: PropTypes.shape({
    utilityRecords: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default UtilityBillInputList;
