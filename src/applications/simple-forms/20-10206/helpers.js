export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}
