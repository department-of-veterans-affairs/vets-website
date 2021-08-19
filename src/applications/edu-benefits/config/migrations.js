import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

export function urlMigration(urlPrefix) {
  // 0 -> 1, we have split the edu bundle into form-specific bundles with a new urlPrefix
  // and this replaces the saved return_url if necessary
  return savedData => {
    const savedReturnUrl = (
      get('returnUrl', savedData.metadata) ||
      get('return_url', savedData.metadata)
    ).toLowerCase();

    if (savedReturnUrl.includes(urlPrefix)) {
      return set(
        'metadata.returnUrl',
        savedReturnUrl.replace(urlPrefix, ''),
        savedData,
      );
    }
    return savedData;
  };
}
