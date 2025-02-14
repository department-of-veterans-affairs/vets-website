export function featureTogglesToTest(toggleNames = [], condition = true) {
  if (toggleNames.length === 0) {
    return [];
  }
  return toggleNames.map(toggle => ({
    name: toggle,
    value: condition,
  }));
}
