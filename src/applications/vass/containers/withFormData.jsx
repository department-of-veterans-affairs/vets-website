import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  selectHydrated,
  hydrateFormData,
  clearFormData,
  loadFormDataFromStorage,
} from '../redux/slices/formSlice';
import { findMissingField, findRouteForField } from '../utils/navigation';
import { FLOW_TYPES, URLS } from '../utils/constants';

/**
 * HOC that ensures required form data fields are available.
 * Attempts to hydrate from sessionStorage if Redux state is empty.
 * Redirects to the appropriate route if required data is missing.
 *
 * @param {React.Component} Component - The component to wrap
 * @param {string[]} requiredFields - Array of required field names
 */
const withFormData = (Component, requiredFields = []) => {
  return props => {
    const store = useStore();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hydrated = useSelector(selectHydrated);
    const formState = useSelector(state => state.vassForm);
    const [isHydrating, setIsHydrating] = useState(!hydrated);

    // Check if all required fields have valid data
    const missingField = useMemo(
      () => findMissingField(requiredFields, formState),
      [formState],
    );
    const hasAllRequiredData = missingField === null;

    // Attempt to hydrate from sessionStorage on mount
    useEffect(
      () => {
        if (!hydrated && !hasAllRequiredData) {
          const savedData = loadFormDataFromStorage();
          if (savedData) {
            dispatch(hydrateFormData(savedData));
          }
          setIsHydrating(false);
        } else {
          setIsHydrating(false);
        }
      },
      [hydrated, hasAllRequiredData, dispatch],
    );

    useEffect(
      () => {
        // Wait for hydration to complete before redirecting
        if (isHydrating) return;

        if (!hasAllRequiredData) {
          // Find the route that sets the missing field
          let redirectPath = findRouteForField(missingField);

          const searchParams = new URLSearchParams();
          // If redirecting to root, clear form data and add current UUID to query params
          if (redirectPath === URLS.VERIFY) {
            dispatch(clearFormData());
            const currentUUID = store.getState().vassForm.uuid;
            if (currentUUID) {
              searchParams.set('uuid', currentUUID);
            }
            if (store.getState().vassForm.flowType === FLOW_TYPES.CANCEL) {
              searchParams.set('cancel', 'true');
            }
          }

          if (searchParams.size > 0) {
            redirectPath = `${redirectPath}?${searchParams.toString()}`;
          }

          // Navigating to the Verify page without the uuid will show the user the Something went wrong page.
          navigate(redirectPath, {
            replace: true,
          });
        }
      },
      [
        hasAllRequiredData,
        missingField,
        navigate,
        isHydrating,
        dispatch,
        store,
      ],
    );

    // Don't render content until hydration is complete and we have all required data
    if (isHydrating || !hasAllRequiredData) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withFormData;
