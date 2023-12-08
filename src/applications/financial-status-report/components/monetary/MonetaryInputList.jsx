import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import InputList from '../shared/InputList';
import { VALIDATION_LIMITS } from '../../constants';
// import { safeNumber } from '../../utils/calculateIncome';

const MonetaryInputList = props => {
  const { errorSchema, formContext } = props;
  const errorList = errorSchema?.monetaryAssets?.__errors;
  const { submitted } = formContext;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);

  const {
    assets: { monetaryAssets = [] },
    gmtData,
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

  // noCashList - remove cash in hand for original asset implementation
  //  only used to protect save in progress for forms prior to streamlinedWaiverAssetUpdate
  const noCashList = monetaryAssets.filter(
    asset => asset?.name?.toLowerCase() !== 'cash',
  );

  // noLiquidAssetsList - remove liquid assets for streamlinedWaiverAssetUpdate
  //  this filter hides all the newly populated fields we collect in previous steps
  const noLiquidAssetsList = noCashList.filter(
    asset =>
      asset?.name?.toLowerCase() !== 'checking accounts' &&
      asset?.name?.toLowerCase() !== 'savings accounts' &&
      asset?.name?.toLowerCase() !== 'cash on hand (not in bank)' &&
      asset?.name?.toLowerCase() !== 'cash in a bank (savings and checkings)',
  );

  const streamlinedList = data['view:streamlinedWaiverAssetUpdate']
    ? noLiquidAssetsList
    : noCashList;

  // only filtering out these options for streamlined candidiates
  const adjustForStreamlined =
    (gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt) ||
    (data['view:streamlinedWaiverAssetUpdate'] &&
      gmtData?.isEligibleForStreamlined &&
      gmtData?.incomeBelowOneFiftyGmt);

  const adjustedAssetList = adjustForStreamlined
    ? streamlinedList
    : monetaryAssets;

  return (
    <InputList
      errorList={errorList}
      inputs={adjustedAssetList}
      title={title}
      prompt={prompt}
      submitted={submitted}
      onChange={event => onChange(event)}
      min={VALIDATION_LIMITS.MONETARY_ASSET_MIN}
      max={VALIDATION_LIMITS.MONETARY_ASSET_MAX}
    />
  );
};

MonetaryInputList.propTypes = {
  errorSchema: PropTypes.shape({
    monetaryAssets: PropTypes.shape({
      __errors: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      isEligibleForStreamlined: PropTypes.bool,
      incomeBelowGmt: PropTypes.bool,
    }),
  }),
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
};

export default MonetaryInputList;
