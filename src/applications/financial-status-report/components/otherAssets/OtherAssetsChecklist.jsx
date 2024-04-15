import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherAssetOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateLiquidAssets } from '../../utils/streamlinedDepends';

const OtherAssetsChecklist = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    assets,
    gmtData,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { otherAssets = [] } = assets;

  // Calculate total assets as necessary
  // - Calculating these assets is only necessary in the long form version
  const updateStreamlinedValues = () => {
    if (
      otherAssets?.length ||
      !gmtData?.isEligibleForStreamlined ||
      gmtData?.incomeBelowGmt
    )
      return;

    // liquid assets are caluclated in cash in bank with this ff
    if (data['view:streamlinedWaiverAssetUpdate']) return;

    const calculatedAssets = calculateLiquidAssets(data);
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        assetsBelowGmt: calculatedAssets < gmtData?.assetThreshold,
      },
    });
  };

  const onChange = ({ target }) => {
    const { value } = target;
    return otherAssets.some(source => source.name === value)
      ? setFormData({
          ...data,
          assets: {
            ...assets,
            otherAssets: otherAssets.filter(source => source.name !== value),
          },
        })
      : setFormData({
          ...data,
          assets: {
            ...assets,
            otherAssets: [...otherAssets, { name: value, amount: '' }],
          },
        });
  };

  const onSubmit = event => {
    event.preventDefault();
    if (!otherAssets?.length && reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const isBoxChecked = option => {
    return otherAssets.some(asset => asset.name === option);
  };
  const title = 'Your other assets';
  const prompt =
    'Select any other items of value (called assets) you own, not including items passed down in your family for generations:';

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <div className="vads-l-grid-container--full">
          <Checklist
            options={otherAssetOptions}
            onChange={onChange}
            title={title}
            prompt={prompt}
            isBoxChecked={isBoxChecked}
          />
          <va-additional-info
            trigger="Why do I need to provide this information?"
            uswds
          >
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={updateStreamlinedValues}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
      </fieldset>
    </form>
  );
};

OtherAssetsChecklist.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      otherAssets: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      assetThreshold: PropTypes.number,
      incomeBelowGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
    }),
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
    'view:streamlinedWaiverAssetUpdate': PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherAssetsChecklist;
