import { isProfileLoading } from 'platform/user/selectors';
/**
 * Map state values to create selector for veteran prefill data properties
 * @param {Object} state - the current state values
 * @returns {Object} - veteran prefill data properties to use in components
 */
export function selectVeteranPrefillData(state) {
  const {
    veteranPrefillData: { hasServerError, loading, parsedData },
  } = state;
  return {
    isLoading: isProfileLoading(state) || loading,
    hasServerError,
    parsedData,
  };
}
