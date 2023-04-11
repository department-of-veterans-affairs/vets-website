import { useCallback } from 'react';
import { FIELD_IDS } from '@@vap-svc/constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { PROFILE_PATHS } from '../constants';

export const useContactInfoDeepLink = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const useFieldEditingPage = useToggleValue(
    TOGGLE_NAMES.profileUseFieldEditingPage,
  );

  const generateContactInfoLink = useCallback(
    ({ fieldName, focusOnEditButton = false, returnPath = null }) => {
      const targetId = FIELD_IDS[fieldName];

      const fragment = focusOnEditButton ? `edit-${targetId}` : targetId;

      if (useFieldEditingPage) {
        const fieldNameQuery = `?fieldName=${fieldName}`;
        const returnPathQuery = returnPath ? `&returnPath=${returnPath}` : '';
        return `${PROFILE_PATHS.EDIT}${fieldNameQuery}${returnPathQuery}`;
      }

      return `${PROFILE_PATHS.CONTACT_INFORMATION}#${fragment}`;
    },
    [useFieldEditingPage],
  );

  return { generateContactInfoLink };
};
