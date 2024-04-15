import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';

const OtherAssetsInputList = props => {
  const { errorSchema, formContext } = props;
  const errorList = errorSchema?.otherAssets?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const {
    assets: { otherAssets = [] },
  } = data;

  const onChange = ({ target }) => {
    return dispatch(
      setData({
        ...data,
        assets: {
          ...data.assets,
          otherAssets: otherAssets.map(asset => {
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

  const title = 'Your other assets';
  const prompt = 'What is the value of each of your assets?';

  return (
    <>
      <InputList
        errorList={errorList}
        inputs={otherAssets}
        title={title}
        prompt={prompt}
        submitted={submitted}
        onChange={event => onChange(event)}
        min={VALIDATION_LIMITS.OTHER_ASSETS_MIN}
        max={VALIDATION_LIMITS.OTHER_ASSETS_MAX}
      />
      <va-additional-info
        class="vads-u-margin-top--4"
        trigger="Why do I need to provide this information?"
        uswds
      >
        We ask for details about items of value such as jewelry and art because
        it gives us a picture of your financial situation and allows us to make
        a more informed decision regarding your request.
      </va-additional-info>
      <va-additional-info
        trigger="What if I don’t know the estimated value of an asset?"
        uswds
      >
        Don’t worry. We just want to get an idea of items of value you may own
        so we can better understand your financial situation. Include the amount
        of money you think you would get if you sold the asset. To get an idea
        of prices, you can check these places:
        <ul>
          <li>Online forums for your community</li>
          <li>Classified ads in local newspapers</li>
          <li>
            Websites or forums that appraise the value of items like jewelry and
            art
          </li>
        </ul>
      </va-additional-info>
    </>
  );
};

OtherAssetsInputList.propTypes = {
  errorSchema: PropTypes.shape({
    otherAssets: PropTypes.shape({
      __errors: PropTypes.array,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default OtherAssetsInputList;
