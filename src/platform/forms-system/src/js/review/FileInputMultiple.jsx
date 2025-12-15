import React from 'react';

const ReviewField = data => {
  const { formData: files = [] } = data.children.props;
  if (files.length === 0) {
    return (
      <div className="review-row">
        <dt>Files</dt>
        <dd>No files uploaded</dd>
      </div>
    );
  }

  return (
    <>
      {files.map((file, index) => (
        <React.Fragment key={index}>
          <div className="review-row">
            <dt>File name</dt>
            <dd>{file.name || 'No file name'}</dd>
          </div>
          {file.size && (
            <div className="review-row">
              <dt>File size</dt>
              <dd>{(file.size / 1024).toFixed(1)} KB</dd>
            </div>
          )}
          {file.type && (
            <div className="review-row">
              <dt>File type</dt>
              <dd>{file.type}</dd>
            </div>
          )}
          {file.additionalData && (
            <div className="review-row vads-u-margin-bottom--5">
              <dt>Additional Information</dt>
              <dd>{JSON.stringify(file.additionalData)}</dd>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ReviewField;
