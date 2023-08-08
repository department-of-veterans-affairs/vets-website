import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherAssetOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalAssets } from '../../utils/streamlinedDepends';

const OtherAssetsChecklist = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { assets, gmtData } = data;
  const { otherAssets = [] } = assets;

  // Calculate total assets as necessary
  // - Calculating these assets is only necessary in the long form version
  const updateStreamlinedValues = () => {
    if (
      otherAssets?.length ||
      !gmtData?.isElidgibleForStreamlined ||
      gmtData?.incomeBelowGmt
    )
      return;

    const calculatedAssets = calculateTotalAssets(data);
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        assetsBelowGMT: calculatedAssets < gmtData?.assetThreshold,
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

  const isBoxChecked = option => {
    return otherAssets.some(asset => asset.name === option);
  };
  const title = 'Your other assets';
  const prompt =
    'Select any other items of value (called assets) you own, not including items passed down in your family for generations:';

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <div className="vads-l-grid-container--full">
          <Checklist
            options={otherAssetOptions}
            onChange={onChange}
            title={title}
            prompt={prompt}
            isBoxChecked={isBoxChecked}
          />
          <va-additional-info trigger="Why do I need to provide this information?">
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
      isElidgibleForStreamlined: PropTypes.bool,
    }),
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherAssetsChecklist;
