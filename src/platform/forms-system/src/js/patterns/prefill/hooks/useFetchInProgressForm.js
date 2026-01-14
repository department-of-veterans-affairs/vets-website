import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInProgressForm } from 'platform/forms/exportsFile';

/**
 * Custom hook to fetch in-progress form data for Personal Information
 * Prevents infinite loops by only fetching once when form data is minimal
 */
export const useFetchInProgressForm = prefillTransformer => {
  const formState = useSelector(state => state.form);
  const dispatch = useDispatch();

  useEffect(
    () => {
      const { loadedData, formId } = formState || {};
      // Only fetch if personal information data has not been fetched
      // formData will usually have at least one property even without personal information data
      // FUTURE: check on this later when this pattern gets consumers
      if (Object.keys(loadedData?.formData).length <= 1) {
        // Dispatch the thunk to fetch prefill data
        dispatch(fetchInProgressForm(formId, null, true, prefillTransformer));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
