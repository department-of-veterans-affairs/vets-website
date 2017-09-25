import _ from 'lodash/fp';

export default [
  // 0 -> 1, we have split the edu bundle into form-specific bundles with a new urlPrefix
  // and this replaces the saved returnUrl if necessary
  (savedData) => {
    const savedReturnUrl = _.get('returnUrl', savedData);

    if (savedReturnUrl.includes('/5495')) {
      const newData = _.set('returnUrl', savedReturnUrl.replace(/\/5495/, ''));
      return newData;
    }
    return savedData;
  }
];
