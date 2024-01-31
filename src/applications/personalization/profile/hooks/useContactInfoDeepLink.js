import { useCallback } from 'react';
import { PROFILE_PATHS } from '../constants';

export const useContactInfoDeepLink = () => {
  const generateContactInfoLink = useCallback(
    ({ fieldName, returnPath = null }) => {
      const fieldNameQuery = `?fieldName=${fieldName}`;
      const returnPathQuery = returnPath ? `&returnPath=${returnPath}` : '';
      return `${PROFILE_PATHS.EDIT}${fieldNameQuery}${returnPathQuery}`;
    },
    [],
  );

  return { generateContactInfoLink };
};
