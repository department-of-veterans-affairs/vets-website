import { useCallback, useState } from 'react';
import {
  createFormStateFromQuery,
  validateForm,
} from '../reducers/searchQuery';

const useSearchFormState = currentQuery => {
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  const [draftFormState, setDraftFormState] = useState(() =>
    createFormStateFromQuery(currentQuery),
  );

  const updateDraftState = useCallback(updater => {
    setDraftFormState(prev => {
      const updates =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return { ...updates, ...validateForm(prev, updates) };
    });
  }, []);

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
    selectedServiceType,
    setSelectedServiceType,
  };
};

export default useSearchFormState;
