// useDetectFieldChanges Hook
// This hook is designed to monitor changes with formData.reviewNavigation.
// whether the user is in a streamlined state ('short', 'long', or 'none').
// The hook returns a boolean indicating whether the "Review" button should be displayed.
import { useEffect, useRef, useState } from 'react';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';
import { setGlobalState } from '../utils/checkGlobalState';

// helper function to get the streamlined value
const getStreamlinedValue = (isStreamlinedShort, isStreamlinedLong) => {
  if (isStreamlinedShort) return 'streamlined-short';
  if (isStreamlinedLong) return 'streamlined-long';
  return 'streamlined-false';
};

const spouseQuestions = [
  'isMarried',
  'spouseHasAdditionalIncome',
  'spouseHasSocialSecurity',
  'spouseHasBenefits',
  'spouseIsEmployed',
];

// Helper function to check if spouse details changed
const didSpouseDetailsChange = (prevQuestions, currentQuestions) => {
  // Compare each spouse question to see if it changed
  return spouseQuestions.some(
    key => prevQuestions?.[key] !== currentQuestions?.[key],
  );
};

// Helper function to check if spouse details are incomplete
const isSpouseDetailsIncomplete = currentQuestions => {
  if (currentQuestions.isMarried) {
    // slice(1) to skip isMarried
    return spouseQuestions.slice(1).some(key => !currentQuestions?.[key]);
  }
  return false;
};

// in a utility file, let's call it formUtils.js
export const shouldShowSpouseExplainer = formData => {
  const currentQuestions = formData?.questions || {};
  const spouseIncomplete = isSpouseDetailsIncomplete(currentQuestions);
  return formData?.reviewNavigation && spouseIncomplete;
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
        setGlobalState({ spouseChanged: true });
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
