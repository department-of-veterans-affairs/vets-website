import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export function useDatadogLogging() {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  return useToggleValue(TOGGLE_NAMES.virtualAgentEnableDatadogLogging);
}
