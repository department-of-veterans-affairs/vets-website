import _ from 'lodash/fp';

export default [
  // 0 -> 1, we had a bug where isSpanishHispanicLatino was defaulted in the wrong place
  // and this removes it and defaults it in the right spot if necessary
  (savedData) => {
    const newData = savedData;
    newData.formData = _.unset('isSpanishHispanicLatino', savedData.formData);

    if (typeof _.get('view:demographicCategories.isSpanishHispanicLatino', newData.formData) === 'undefined') {
      newData.formData = _.set('view:demographicCategories.isSpanishHispanicLatino', false, newData.formData);
      return newData;
    }

    return newData;
  },
  // 1 -> 2, we converted the children page to a dependents page, then updated
  // all the field names to not reference child/children anymore
  ({ formData, metadata }) => {
    let newData = formData;

    if (typeof newData['view:reportChildren'] !== 'undefined') {
      newData = _.unset('view:reportChildren', newData);
      newData['view:reportDependents'] = formData['view:reportChildren'];
    }

    if (newData.children) {
      newData = _.unset('children', newData);
      newData.dependents = formData.children.map(child => {
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

    return { formData: newData, metadata };
  },
  // 2 -> 3, we're updating the url for the dependent info page since it's for dependents
  // and not just children anymore
  ({ formData, metadata }) => {
    const url = metadata.returnUrl || metadata.return_url;
    let newMetadata = metadata;

    if (url === '/household-information/child-information') {
      newMetadata = _.set('returnUrl', '/household-information/dependent-information', metadata);
    }

    return { formData, metadata: newMetadata };
  }
];
