// useDetectFieldChanges Hook
// This hook is designed to monitor changes with formData.reviewNavigation.
// whether the user is in a streamlined state ('short', 'long', or 'none').
// The hook returns a boolean indicating whether the "Review" button should be displayed.

import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';

// helper function to get the streamlined value
const getStreamlinedValue = (isStreamlinedShort, isStreamlinedLong) => {
  if (isStreamlinedShort) return 'streamlined-short';
  if (isStreamlinedLong) return 'streamlined-long';
  return 'streamlined-false';
};

// Helper function to check if spouse details changed
const didSpouseDetailsChange = (prevQuestions, currentQuestions) => {
  return !isEqual(
    {
      isMarried: prevQuestions?.isMarried,
      spouseHasAdditionalIncome: prevQuestions?.spouseHasAdditionalIncome,
      spouseHasSocialSecurity: prevQuestions?.spouseHasSocialSecurity,
      spouseHasBenefits: prevQuestions?.spouseHasBenefits,
      spouseIsEmployed: prevQuestions?.spouseIsEmployed,
    },
    {
      isMarried: currentQuestions?.isMarried,
      spouseHasAdditionalIncome: currentQuestions?.spouseHasAdditionalIncome,
      spouseHasSocialSecurity: currentQuestions?.spouseHasSocialSecurity,
      spouseHasBenefits: currentQuestions?.spouseHasBenefits,
      spouseIsEmployed: currentQuestions?.spouseIsEmployed,
    },
  );
};

// Helper function to check if spouse details are incomplete
const isSpouseDetailsIncomplete = currentQuestions => {
  return (
    currentQuestions?.isMarried &&
    (!currentQuestions?.spouseHasAdditionalIncome ||
      !currentQuestions?.spouseHasSocialSecurity ||
      !currentQuestions?.spouseHasBenefits ||
      !currentQuestions?.spouseIsEmployed)
  );
};

const useDetectFieldChanges = formData => {
  const prevDataRef = useRef();
  const [shouldShowReviewButton, setShouldShowReviewButton] = useState(true);

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

      const prevStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(prevData),
        isStreamlinedLongForm(prevData),
      );

      const currentStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(formData),
        isStreamlinedLongForm(formData),
      );

      const prevQuestions = prevData?.questions || {};
      const currentQuestions = formData?.questions || {};

      const didSpouseChange = didSpouseDetailsChange(
        prevQuestions,
        currentQuestions,
      );
      const spouseIncomplete = isSpouseDetailsIncomplete(currentQuestions);

      if (didSpouseChange && spouseIncomplete) {
        setShouldShowReviewButton(false);
      } else if (prevStreamlinedValue !== currentStreamlinedValue) {
        setShouldShowReviewButton(false);
      } else {
        setShouldShowReviewButton(true);
      }

      prevDataRef.current = formData;
    },
    [formData],
  );

  return { shouldShowReviewButton };
};

export default useDetectFieldChanges;
