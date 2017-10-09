import _ from 'lodash/fp';

export default [
  // 0 -> 1, we had a bug where isSpanishHispanicLatino was defaulted in the wrong place
  // and this removes it and defaults it in the right spot if necessary
  (savedData) => {
    const newData = _.unset('isSpanishHispanicLatino', savedData);

    if (typeof _.get('view:demographicCategories.isSpanishHispanicLatino', newData) === 'undefined') {
      return _.set('view:demographicCategories.isSpanishHispanicLatino', false, newData);
    }

    return newData;
  },
  // 1 -> 2, we converted the children page to a dependents page, then updated
  // all the field names to not reference child/children anymore
  (savedData) => {
    let newData = savedData;

    if (typeof newData['view:reportChildren'] !== 'undefined') {
      newData = _.unset('view:reportChildren', newData);
      newData['view:reportDependents'] = savedData['view:reportChildren'];
    }

    if (newData.children) {
      newData = _.unset('children', newData);
      newData.dependents = savedData.children.map(child => {
        const dependent = Object.keys(child).reduce((acc, field) => {
          if (field === 'view:childSupportDescription') {
            acc['view:dependentSupportDescription'] = child[field];
          } else if (field === 'childEducationExpenses') {
            acc.dependentEducationExpenses = child[field];
          } else if (field === 'childRelation') {
            acc.dependentRelation = child[field];
          } else if (field.startsWith('child')) {
            const newField = field.replace(/^child/, '');
            const [firstLetter, ...restOfField] = newField;
            acc[`${firstLetter.toLowerCase()}${restOfField.join('')}`] = child[field];
          } else {
            acc[field] = child[field];
          }

          return acc;
        }, {});

        return dependent;
      });
    }

    return newData;
  }
];
