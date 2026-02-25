import React from 'react';
import PropTypes from 'prop-types';

export const UploadDocumentsReview = ({ children }) => (
  <>
    {children?.props?.formData?.map((file, index) => (
      <div key={index}>
        <div className="review-row">
          <dt>File name</dt>
          <dd>{file.name}</dd>
        </div>
        <div className="review-row vads-u-margin-bottom--5">
          <dt>Document type</dt>
          <dd>{file.additionalData.attachmentType}</dd>
        </div>
      </div>
    ))}
  </>
);

UploadDocumentsReview.propTypes = {
  children: PropTypes.node,
};
