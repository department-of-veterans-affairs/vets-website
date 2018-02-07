import React from 'react';
import _ from 'lodash/fp';

export function prefillTransformer(pages, formData, metadata) {
  if (formData && formData.serviceBranches) {
    // Mostly we'll be getting branch lists of one or two branches, creating a Set seems like overkill
    const allowedBranches = pages.veteranInformation.schema.properties.serviceBranch.enum;
    const validUserBranches = formData.serviceBranches.filter(branch => allowedBranches.includes(branch));

    const newData = _.unset('serviceBranches', formData);
    if (validUserBranches.length > 0) {
      newData.serviceBranch = validUserBranches[0];
      return {
        metadata,
        formData: newData,
        pages: _.set('veteranInformation.schema.properties.serviceBranch.enum', validUserBranches, pages)
      };
    }

    return {
      metadata,
      formData: newData,
      pages
    };
  }

  return {
    metadata,
    formData,
    pages
  };
}

export function photoReviewDescription(props) {
  return (
    <div className="va-growable-background">
      <img className={'photo-preview'} src={`/v0/vic/profile_photo_attachments${props.confirmationCode}`} alt="review"/>
    </div>);
}
