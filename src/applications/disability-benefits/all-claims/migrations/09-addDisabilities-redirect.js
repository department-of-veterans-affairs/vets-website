/**
 * Correcting url change during release of changes to addDisabilities page
 * This redirects users with a saved form on new-disabilities-revised/add to
 *  new-disabilities/add
 */

export default function addDisabilitiesRedirect(savedData) {
  const { returnUrl } = savedData.metadata;

  if (returnUrl === '/new-disabilities-revised/add') {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/new-disabilities/add',
      },
    };
  }

  return savedData;
}
