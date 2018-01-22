import _ from 'lodash/fp';

export function prefillTransform(pages, formData, metadata) {
  if (formData && Array.isArray(formData.serviceBranches) && formData.serviceBranches.length) {
    const newData = _.unset('serviceBranches', formData);
    newData.serviceBranch = formData.serviceBranches[0];
    return {
      metadata,
      formData: newData,
      pages: _.set('veteranInformation.schema.properties.serviceBranch.enum', formData.serviceBranches, pages)
    };
  }

  return {
    metadata,
    formData,
    pages
  };
}
