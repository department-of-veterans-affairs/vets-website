import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { otherAssetOptions } from '../../constants/checkboxSelections';
import Checklist from '../utils/CheckList';

const OtherAssetsChecklist = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { assets } = formData;
  const { otherAssetsEnhanced = [] } = assets;

  const onChange = ({ target }) => {
    const { value } = target;
    return otherAssetsEnhanced.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            assets: {
              ...assets,
              otherAssetsEnhanced: otherAssetsEnhanced.filter(
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
              otherAssetsEnhanced: [
                ...otherAssetsEnhanced,
                { name: value, amount: '' },
              ],
            },
          }),
        );
  };

  const isBoxChecked = option => {
    return otherAssetsEnhanced.some(asset => asset.name === option);
  };

  return (
    <>
      <Checklist
        options={otherAssetOptions}
        onChange={onChange}
        isBoxChecked={isBoxChecked}
      />
      <va-additional-info
        class="vads-u-margin-top--4"
        trigger="Why do I need to provide this information?"
      >
        We ask for details about items of value such as jewelry and art because
        it gives us a picture of your financial situation and allows us to make
        a more informed decision regarding your request.
      </va-additional-info>
    </>
  );
};

export default OtherAssetsChecklist;
