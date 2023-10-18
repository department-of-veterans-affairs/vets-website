import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { monetaryAssets as monetaryAssetList } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const MonetaryCheckList = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { assets, gmtData } = data;
  const { monetaryAssets = [] } = assets;

  const onChange = ({ target }) => {
    const { value } = target;
    return monetaryAssets.some(source => source.name === value)
      ? setFormData({
          ...data,
          assets: {
            ...assets,
            monetaryAssets: monetaryAssets.filter(
              source => source.name !== value,
            ),
          },
        })
      : setFormData({
          ...data,
          assets: {
            ...assets,
            monetaryAssets: [...monetaryAssets, { name: value, amount: '' }],
          },
        });
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
    : monetaryAssetList;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <Checklist
          title={title}
          prompt={prompt}
          options={adjustedAssetList}
          onChange={event => onChange(event)}
          isBoxChecked={isBoxChecked}
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={goForward}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

MonetaryCheckList.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      incomeBelowGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
      incomeBelowOneFiftyGmt: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
    'view:streamlinedWaiverAssetUpdate': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default MonetaryCheckList;
