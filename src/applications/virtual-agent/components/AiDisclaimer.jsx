import React, { useMemo } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

export default function AiDisclaimer() {
  const {
    useToggleValue,
    TOGGLE_NAMES,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isToggleLoading = useToggleLoadingValue();
  const isEnabled = useToggleValue(TOGGLE_NAMES.virtualAgentShowAiDisclaimer);

  const showAiDisclaimer = useMemo(
    () => {
      return isEnabled && !isToggleLoading;
    },
    [isEnabled, isToggleLoading],
  );

  if (!showAiDisclaimer) {
    return null;
  }

  return (
    <li data-testid="ai-disclaimer">
      This answer is AI-generated and it may contain inaccuracies. Please verify
      any important information.
    </li>
  );
}
