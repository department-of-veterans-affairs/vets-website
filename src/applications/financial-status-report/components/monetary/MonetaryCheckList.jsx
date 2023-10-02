import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { monetaryAssets as monetaryAssetList } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const MonetaryCheckList = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { assets, gmtData } = formData;
  const { monetaryAssets = [] } = assets;

  const onChange = ({ target }) => {
    const { value } = target;
    return monetaryAssets.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            assets: {
              ...assets,
              monetaryAssets: monetaryAssets.filter(
                source => source.name !== value,
              ),
            },
          }),
        )
      : dispatch(
          setData({
            ...formData,
            assets: {
              ...assets,
              monetaryAssets: [...monetaryAssets, { name: value, amount: '' }],
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return monetaryAssets.some(asset => asset.name === option);
  };
  const title = 'Your household assets';
  const prompt = 'Select any of these financial assets you have:';

  // noCashList - remove cash in hand for original asset implementation
  //  only used to protect save in progress for forms prior to streamlinedWaiverAssetUpdate
  const noCashList = monetaryAssetList.filter(
    asset => asset.toLowerCase() !== 'cash',
  );

  // noLiquidAssetsList - remove liquid assets for streamlinedWaiverAssetUpdate
  //  this filter hides all the fields we collect in previous steps
  const noLiquidAssetsList = noCashList.filter(
    asset =>
      asset.toLowerCase() !== 'checking accounts' &&
      asset.toLowerCase() !== 'savings accounts',
  );

  const streamlinedList = formData['view:streamlinedWaiverAssetUpdate']
    ? noLiquidAssetsList
    : noCashList;

  // only filtering out these options for streamlined candidiates
  const adjustForStreamlined =
    (gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt) ||
    (formData['view:streamlinedWaiverAssetUpdate'] &&
      gmtData?.isEligibleForStreamlined &&
      gmtData?.incomeBelowOneFiftyGmt);

  const adjustedAssetList = adjustForStreamlined
    ? streamlinedList
    : monetaryAssetList;

  return (
    <Checklist
      title={title}
      prompt={prompt}
      options={adjustedAssetList}
      onChange={event => onChange(event)}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default MonetaryCheckList;
