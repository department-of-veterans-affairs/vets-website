import _ from 'lodash/fp';

export function urlMigration(formId) {
  // 0 -> 1, we have split the edu bundle into form-specific bundles with a new urlPrefix
  // and this replaces the saved returnUrl if necessary
  return (savedData) => {
    const savedReturnUrl = _.get('return_url', savedData.metadata);

    if (savedReturnUrl.includes(formId)) {
      const newData = _.set('metadata.return_url', savedReturnUrl.replace(formId, ''), savedData);
      return newData;
    }
    return savedData;
  };
}
