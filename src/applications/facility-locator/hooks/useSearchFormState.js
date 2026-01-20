import { useCallback, useState } from 'react';
import {
  createFormStateFromQuery,
  validateForm,
} from '../reducers/searchQuery';

/**
 * Custom hook for managing search form draft state.
 *
 * Implements the dual-state pattern where user input is held in local state
 * (draft) before being committed to Redux on form submission. This prevents
 * search results from updating while the user is still editing.
 *
 * @param {Object} currentQuery - The current Redux query state
 * @returns {Object} Form state and handlers
 */
const useSearchFormState = currentQuery => {
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  const [draftFormState, setDraftFormState] = useState(() =>
    createFormStateFromQuery(currentQuery),
  );

  /**
   * Updates draft state with automatic validation.
   * Accepts either an object to merge or an updater function.
   */
  const updateDraftState = useCallback(updater => {
    setDraftFormState(prev => {
      const updates =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return { ...updates, ...validateForm(prev, updates) };
    });
  }, []);

  /**
   * Handler for VAMC service autosuggest changes.
   * Passes updates directly to updateDraftState.
   */
  const handleVamcDraftChange = useCallback(
    updates => updateDraftState(updates),
    [updateDraftState],
  );

  /**
   * Handler for location/address selection from autosuggest.
   * Passes updates directly to updateDraftState.
   */
  const handleLocationSelection = useCallback(
    updates => updateDraftState(updates),
    [updateDraftState],
  );

  /**
   * Handler for facility type dropdown changes.
   * Resets serviceType and vamcServiceDisplay when facility type changes.
   */
  const handleFacilityTypeChange = useCallback(
    e => {
      updateDraftState(prev => ({
        ...prev,
        facilityType: e.target.value,
        serviceType: null,
        vamcServiceDisplay: null,
      }));
    },
    [updateDraftState],
  );

  /**
   * Handler for service type changes.
   * Handles both dropdown and typeahead (CC_PROVIDER) selections.
   * Treats 'All' as null to indicate no filter.
   */
  const handleServiceTypeChange = useCallback(
    ({ target, selectedItem }) => {
      setSelectedServiceType(selectedItem);
      const option = target.value.trim();
      const serviceType = option === 'All' ? null : option;
      updateDraftState({ serviceType });
    },
    [updateDraftState],
  );

  return {
    draftFormState,
    setDraftFormState,
    updateDraftState,
    handleFacilityTypeChange,
    handleServiceTypeChange,
    handleLocationSelection,
    handleVamcDraftChange,
    selectedServiceType,
    setSelectedServiceType,
  };
};

export default useSearchFormState;
