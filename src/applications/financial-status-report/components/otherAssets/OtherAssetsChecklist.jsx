import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherAssetOptions } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';

const OtherAssetsChecklist = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  useWebComponents,
}) => {
  const {
    assets,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { otherAssets = [] } = assets;

  const onChange = ({ name, checked }) => {
    setFormData({
      ...data,
      assets: {
        ...assets,
        otherAssets: checked
          ? [...otherAssets, { name, amount: '' }]
          : otherAssets.filter(asset => asset.name !== name),
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
          <va-additional-info trigger="Why do I need to provide this information?">
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          <va-additional-info trigger="What is specialty equipment or technology?">
            Specialty equipment or technology refers to tools, machinery, or
            devices designed for specific industries, tasks, or functions that
            go beyond general-purpose equipment. Examples include backhoes,
            excavators, MRI machines, and quantum computers.
          </va-additional-info>
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={goForward}
            submitToContinue
            useWebComponents={useWebComponents}
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
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherAssetsChecklist;
