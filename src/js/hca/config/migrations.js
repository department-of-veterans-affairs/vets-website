import _ from 'lodash/fp';

export default [
  // 0 -> 1, we had a bug where isSpanishHispanicLatino was defaulted in the wrong place
  // and this removes it and defaults it in the right spot if necessary
  (savedData) => {
    const newData = _.unset('isSpanishHispanicLatino', savedData.formData);

    if (typeof _.get('view:demographicCategories.isSpanishHispanicLatino', newData.formData) === 'undefined') {
      return _.set('view:demographicCategories.isSpanishHispanicLatino', false, newData.formData);
    }

    return newData;
  }
];
