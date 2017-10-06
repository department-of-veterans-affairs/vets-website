import _ from 'lodash/fp';

export function urlMigration(urlPrefix) {
  // 0 -> 1, we have split the edu bundle into form-specific bundles with a new urlPrefix
  // and this replaces the saved return_url if necessary
  return (savedData) => {
    const savedReturnUrl = _.get('return_url', savedData.metadata);

    if (savedReturnUrl.includes(urlPrefix.toLowerCase())) {
      const newData = _.set('metadata.return_url', savedReturnUrl.replace(formId, ''), savedData);
      return newData;
    }
    return savedData;
  };
}
