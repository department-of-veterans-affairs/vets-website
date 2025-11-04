import React, { useEffect, useRef } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { monetaryAssets as monetaryAssetList } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const MonetaryCheckList = ({
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
  const { monetaryAssets = [] } = assets;

  const headerRef = useRef(null);
  // Header ref for setting focus
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const onChange = ({ name, checked }) => {
    setFormData({
      ...data,
      assets: {
        ...assets,
        monetaryAssets: checked
          ? [...monetaryAssets, { name, amount: '' }]
          : monetaryAssets.filter(asset => asset.name !== name),
      },
    });
  };

  const isBoxChecked = option => {
    return monetaryAssets.some(asset => asset.name === option);
  };

  const title = 'Your household assets';
  const prompt = 'Select any of these financial assets you have:';

  // reviewDepends - only show/handle review alert and navigation
  const reviewDepends = reviewNavigation && showReviewNavigation;

  const handleBackNavigation = () => {
    if (reviewDepends) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            {title}
          </h3>
        </legend>
        {reviewDepends ? (
          <ReviewPageNavigationAlert data={data} title="household assets" />
        ) : null}
        <Checklist
          prompt={prompt}
          options={monetaryAssetList}
          onChange={event => onChange(event)}
          isBoxChecked={isBoxChecked}
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={goForward}
          submitToContinue
          useWebComponents={useWebComponents}
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

    reviewNavigation: PropTypes.bool,
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default MonetaryCheckList;
