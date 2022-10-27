import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';

const MonetaryInputList = ({ errorSchema }) => {
  const errorList = errorSchema?.monetaryAssets?.__errors;

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

  return (
    <div>
      <legend className="schemaform-block-title">Your household assets</legend>
      <p>
        How much are each of your financial assets worth? Include the total
        amounts for you and your spouse.
      </p>
      {monetaryAssets?.map((asset, key) => (
        <div key={asset.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={asset.name}
            name={asset.name}
            value={asset.amount}
            id={asset.name + key}
            error={
              errorList.includes(asset.name) ? 'Enter valid dollar amount' : ''
            }
            inputmode="decimal"
            onInput={onChange}
            required
          />
        </div>
      ))}
    </div>
  );
};

MonetaryInputList.propTypes = {
  errorSchema: PropTypes.shape({
    monetaryAssets: PropTypes.array,
  }),
};

export default MonetaryInputList;
