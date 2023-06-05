import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';

const MonetaryInputList = props => {
  const { errorSchema, formContext } = props;
  const errorList = errorSchema?.monetaryAssets?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    assets: { monetaryAssets = [] },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        assets: {
          ...data.assets,
          monetaryAssets: monetaryAssets.map(asset => {
            if (asset.name === target.name) {
              return {
                ...asset,
                amount: target.value,
              };
            }
            return asset;
          }),
        },
      }),
    );
  };

  const title = 'Your household assets';
  const prompt =
    'How much are each of your financial assets worth? Include the total amounts for you and your spouse.';

  return (
    <InputList
      errorList={errorList}
      inputs={monetaryAssets}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
    />
  );
};

MonetaryInputList.propTypes = {
  errorSchema: PropTypes.shape({
    monetaryAssets: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default MonetaryInputList;
