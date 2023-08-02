import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherAssetOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalAssets } from '../../utils/streamlinedDepends';

const OtherAssetsChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { assets, gmtData } = formData;
  const { otherAssets = [] } = assets;

  useEffect(() => {
    if (!gmtData?.isElidgibleForStreamlined) return;

    const calculatedAssets = calculateTotalAssets(formData);
    dispatch(
      setData({
        ...formData,
        gmtData: {
          ...gmtData,
          assetsBelowGMT: calculatedAssets < gmtData?.assetThreshold,
        },
      }),
    );
  }, []);

  const onChange = ({ target }) => {
    const { value } = target;
    return otherAssets.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            assets: {
              ...assets,
              otherAssets: otherAssets.filter(source => source.name !== value),
            },
          }),
        )
      : dispatch(
          setData({
            ...formData,
            assets: {
              ...assets,
              otherAssets: [...otherAssets, { name: value, amount: '' }],
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return otherAssets.some(asset => asset.name === option);
  };
  const title = 'Your other assets';
  const prompt =
    'Select any other items of value (called assets) you own, not including items passed down in your family for generations:';

  return (
    <>
      <Checklist
        options={otherAssetOptions}
        onChange={onChange}
        title={title}
        prompt={prompt}
        isBoxChecked={isBoxChecked}
      />
      <va-additional-info trigger="Why do I need to provide this information?">
        We ask for details about items of value such as jewelry and art because
        it gives us a picture of your financial situation and allows us to make
        a more informed decision regarding your request.
      </va-additional-info>
    </>
  );
};

export default OtherAssetsChecklist;
