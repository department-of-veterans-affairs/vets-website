// libs
import React from 'react';
import { connect } from 'react-redux';

// components
import RoutedSavableReviewPageOld from 'platform/forms/save-in-progress/RoutedSavableReviewPage';
import RoutedSavableReviewPageNew from 'platform/forms/containers/review/RoutedSavableReviewPage';

// selectors
import { reviewPageFlipperSelector } from 'platform/forms/selectors/review';

function RoutedSavableReviewPageFlipper(props) {
  const { isNewReviewPageEnabled } = props;

  return (
    isNewReviewPageEnabled && <RoutedSavableReviewPageNew {...props} />) || (
    <RoutedSavableReviewPageOld {...props} />
  );
}

export default connect(state => {
  const isNewReviewPageEnabled = reviewPageFlipperSelector(state);

  return {
    isNewReviewPageEnabled,
  };
})(RoutedSavableReviewPageFlipper);
