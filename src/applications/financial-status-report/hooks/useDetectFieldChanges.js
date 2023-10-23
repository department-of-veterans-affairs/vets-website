// useDetectFieldChanges Hook
// This hook is designed to monitor changes in formData, specifically in
// the 'income', 'assets', and 'expenses' fields. It also keeps track of
// whether the user is in a streamlined state ('short', 'long', or 'none').
// The hook returns a boolean indicating whether the "Review" button should be displayed.

import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';

const useDetectFieldChanges = formData => {
  const prevDataRef = useRef();
  const [shouldShowReviewButton, setShouldShowReviewButton] = useState(true);

  const getStreamlinedValue = (isStreamlinedShort, isStreamlinedLong) => {
    if (isStreamlinedShort) return 'streamlined-short';
    if (isStreamlinedLong) return 'streamlined-long';
    return 'streamlined-false';
  };

  useEffect(
    () => {
      if (!formData?.reviewNavigation) {
        return;
      }

      const prevData = prevDataRef.current;
      if (!prevData) {
        prevDataRef.current = formData;
        return;
      }

      // Fields to monitor for changes
      const fieldsToWatch = ['income', 'assets', 'expenses'];
      const didFieldChange = fieldsToWatch.some(
        field => !isEqual(prevData[field], formData[field]),
      );

      const prevStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(prevData),
        isStreamlinedLongForm(prevData),
      );

      const currentStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(formData),
        isStreamlinedLongForm(formData),
      );

      // Spouse-related logic starts here
      const prevQuestions = prevData?.questions || {};
      const currentQuestions = formData?.questions || {};

      // Check if any spouse details changed
      const didSpouseDetailsChange = !isEqual(
        {
          isMarried: prevQuestions.isMarried,
          spouseHasAdditionalIncome: prevQuestions.spouseHasAdditionalIncome,
          spouseHasSocialSecurity: prevQuestions.spouseHasSocialSecurity,
          spouseHasBenefits: prevQuestions.spouseHasBenefits,
          spouseIsEmployed: prevQuestions.spouseIsEmployed,
        },
        {
          isMarried: currentQuestions.isMarried,
          spouseHasAdditionalIncome: currentQuestions.spouseHasAdditionalIncome,
          spouseHasSocialSecurity: currentQuestions.spouseHasSocialSecurity,
          spouseHasBenefits: currentQuestions.spouseHasBenefits,
          spouseIsEmployed: currentQuestions.spouseIsEmployed,
        },
      );

      // Check if spouse details are incomplete
      const isSpouseDetailsIncomplete =
        currentQuestions.isMarried &&
        (!currentQuestions.spouseHasAdditionalIncome ||
          !currentQuestions.spouseHasSocialSecurity ||
          !currentQuestions.spouseHasBenefits ||
          !currentQuestions.spouseIsEmployed);

      if (didFieldChange || prevStreamlinedValue !== currentStreamlinedValue) {
        // if the previous state is streamlined short and the current state isMarried = true hide the review button so the user can finish the form
        // if previous state is streamlined short and current state is streamlined long or false hide the review button so the user can finish the form
        // if previous state is streamlined long and current state false hide the review button so the user can finish the form
      }

      // Update the "Review" button state based on the logic above
      if (didSpouseDetailsChange && isSpouseDetailsIncomplete) {
        setShouldShowReviewButton(false);
      } else if (
        currentStreamlinedValue === 'streamlined-short' ||
        currentStreamlinedValue === 'streamlined-long'
      ) {
        setShouldShowReviewButton(true);
      } else if (currentStreamlinedValue === 'streamlined-false') {
        setShouldShowReviewButton(false);
      }

      prevDataRef.current = formData;
    },
    [formData],
  );

  return { shouldShowReviewButton };
};

export default useDetectFieldChanges;
