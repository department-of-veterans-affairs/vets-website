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
      We may use artificial intelligence (AI) for these responses. They may
      include inaccurate information. You should verify any important
      information.
    </li>
  );
}
