/**
 * Correcting url change during release of changes to addDisabilities page
 * This redirects users with a saved form on new-disabilities-revised/add to
 *  new-disabilities/add
 */
import DISABILITY_SHARED_CONFIG from '../utils';

export default function addDisabilitiesRedirect(savedData) {
  const { returnUrl } = savedData.metadata;

  if (returnUrl === '/new-disabilities-revised/add') {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: DISABILITY_SHARED_CONFIG.addDisabilities.path,
      },
    };
  }

  return savedData;
}
