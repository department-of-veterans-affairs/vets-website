import { useEffect, useRef } from 'react';

import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';

const useDetectFieldChanges = (formData, callback) => {
  const prevDataRef = useRef(formData);

  useEffect(
    () => {
      const prevData = prevDataRef.current;

      const getStreamlinedValue = (isStreamlinedShort, isStreamlinedLong) => {
        if (isStreamlinedShort) return 'streamlined-short';
        if (isStreamlinedLong) return 'streamlined-long';
        return 'streamlined-false';
      };

      // Determine the previous and current streamlined values
      const prevStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(prevData),
        isStreamlinedLongForm(prevData),
      );

      const currentStreamlinedValue = getStreamlinedValue(
        isStreamlinedShortForm(formData),
        isStreamlinedLongForm(formData),
      );

      // Check if streamlined value changed
      if (prevStreamlinedValue !== currentStreamlinedValue) {
        // console.log(
        //   'Streamlined experience changed from',
        //   prevStreamlinedValue,
        //   'to',
        //   currentStreamlinedValue,
        // );
        callback();
      }

      // Update the previous data for the next run
      prevDataRef.current = formData;
    },
    [formData, callback],
  );
};

export default useDetectFieldChanges;
