import _ from 'lodash/fp';

export function prefillTransformer(pages, formData, metadata) {
    console.log('thing')
    debugger;
    const newFormData = _.set('verified', metadata.verified, formData);
  
    return {
      metadata,
      formData: newFormData,
      pages
    };
  }