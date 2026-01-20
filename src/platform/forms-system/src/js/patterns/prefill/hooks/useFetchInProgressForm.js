import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInProgressForm } from 'platform/forms/exportsFile';
import { prefillTransformer } from '../helpers';

/**
 * Custom hook to fetch in-progress form data with prefill
 * Prevents infinite loops by only fetching once when form data is minimal
 */
export const useFetchInProgressForm = () => {
  const formState = useSelector(state => state.form);
  const dispatch = useDispatch();
  const hasFetchedRef = useRef(false);

  useEffect(
    () => {
      // Only fetch if we haven't fetched yet AND there's no data loaded
      // This prevents infinite loops while still loading data on refresh
      const { loadedData, formId } = formState || {};
      if (
        !hasFetchedRef.current &&
        Object.keys(loadedData?.formData).length <= 1
      ) {
        hasFetchedRef.current = true;
        // Dispatch the thunk to fetch prefill data
        dispatch(fetchInProgressForm(formId, null, true, prefillTransformer));
      }
    },
    [dispatch, formState],
  );
};
