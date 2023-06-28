import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { monetaryAssets as monetaryAssetList } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const MonetaryCheckList = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { assets } = formData;
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

  return (
    <Checklist
      title={title}
      prompt={prompt}
      options={monetaryAssetList}
      onChange={event => onChange(event)}
      isBoxChecked={isBoxChecked}
    />
  );
};

export default MonetaryCheckList;
