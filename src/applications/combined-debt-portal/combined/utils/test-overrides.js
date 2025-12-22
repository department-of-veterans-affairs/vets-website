// Utility to read local testing overrides from the URL query string.
// Usage: ?test_debt_error=true&test_mcp_error=true&test_both_zero=true
export const getTestOverrides = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const parseFlag = key =>
    params.has(key) ? params.get(key) === 'true' : undefined;

  return {
    debtError: parseFlag('test_debt_error'),
    mcpError: parseFlag('test_mcp_error'),
    bothZero: parseFlag('test_both_zero'),
    debtOnly: parseFlag('test_debt_only'),
    allZero: parseFlag('test_all_zero'),
  };
};

export default getTestOverrides;
