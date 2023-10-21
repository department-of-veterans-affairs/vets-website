import { UPDATE_STREAMLINED_ELIGIBILITY_STATUS } from '../constants/actionTypes';
import { setData } from '~/platform/forms-system/src/js/actions';

import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';

// actions/streamlinedWaiverStatus.js
export const updateStreamlinedEligibilityStatus = streamlinedData => ({
  type: UPDATE_STREAMLINED_ELIGIBILITY_STATUS,
  payload: streamlinedData, // { value: true/false, type: 'short'/'long'/'none' }
});
// actions/streamlinedWaiverStatus.js
export const streamlinedWaiverStatus = () => {
  return (dispatch, getState) => {
    const state = getState();
    const currentEligibilityStatus = state.fsr.isStreamlinedEligible; // { value: true/false, type: 'short'/'long'/'none' }
    const currentReviewNavigation = state.form.data.reviewNavigation; // Assuming this exists in your state

    // Initialize new statuses with current statuses as default
    let updateEligibilityStatus = { ...currentEligibilityStatus };
    let newReviewNavigation = currentReviewNavigation;

    // Check if the user is in the streamlined short form
    if (isStreamlinedShortForm(state.fsr.formData)) {
      updateEligibilityStatus = { value: true, type: 'short' };
      newReviewNavigation = true; // Always true for 'short'
    }
    // Check if the user is in the streamlined long form
    else if (isStreamlinedLongForm(state.fsr.formData)) {
      updateEligibilityStatus = { value: true, type: 'long' };
    }
    // If none, set to default
    else {
      updateEligibilityStatus = { value: false, type: 'none' };
    }

    // Logic for toggling reviewNavigation based on changes
    if (
      (currentEligibilityStatus.type === 'short' &&
        updateEligibilityStatus.type !== 'short') ||
      (currentEligibilityStatus.type === 'long' &&
        updateEligibilityStatus.type === 'none')
    ) {
      newReviewNavigation = false;
    }

    // Update only if there's an eligibility change or reviewNavigation change
    if (
      currentEligibilityStatus.value !== updateEligibilityStatus.value ||
      currentEligibilityStatus.type !== updateEligibilityStatus.type ||
      currentReviewNavigation !== newReviewNavigation
    ) {
      dispatch(updateStreamlinedEligibilityStatus(updateEligibilityStatus));
      dispatch(setData({ reviewNavigation: newReviewNavigation }));
    }
  };
};
