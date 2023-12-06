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
}) => {
  const {
    assets,
    gmtData,
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

  // reviewDepends - only show/handle review alert and navigation if
  //  feature flag is on, user is in review mode, and they have not seen the cash pages
  const reviewDepends =
    reviewNavigation && showReviewNavigation && !adjustForStreamlined;

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
          options={adjustedAssetList}
          onChange={event => onChange(event)}
          isBoxChecked={isBoxChecked}
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
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
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default MonetaryCheckList;
