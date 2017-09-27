import _ from 'lodash/fp';

export default [
  // 0 -> 1, we have split the edu bundle into form-specific bundles with a new urlPrefix
  // and this replaces the saved returnUrl if necessary
  (savedData) => {
    const savedReturnUrl = _.get('return_url', savedData.metadata);

    if (savedReturnUrl.includes(savedData.formId)) {
      const formId = new RegExp(`/${savedData.formId}`);
      const newData = _.set(savedData.metadata.return_url, savedReturnUrl.replace(formId, ''));
      return newData;
    }
    return savedData;
  }
];
