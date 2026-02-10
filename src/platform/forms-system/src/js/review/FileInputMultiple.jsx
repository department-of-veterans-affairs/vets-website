import React from 'react';

const formatLabel = key =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();

const ReviewField = data => {
  const { formData: files = [] } = data.children.props;
  const title = data.uiSchema?.['ui:title'];
  if (files.length === 0) {
    return (
      <div className="review-row">
        <dt>{title || 'Files'}</dt>
        <dd>No files uploaded</dd>
      </div>
    );
  }

  return (
    <>
      {title && (
        <div className="review-row">
          <dt>{title}</dt>
          <dd>
            {files.length} {files.length === 1 ? 'file' : 'files'}
          </dd>
        </div>
      )}
      {files.map((file, index) => (
        <React.Fragment key={index}>
          <div className="review-row">
            <dt>File name</dt>
            <dd>{file.name || 'No file name'}</dd>
          </div>
          {file.additionalData &&
            Object.entries(file.additionalData).map(([key, value]) => (
              <div className="review-row" key={key}>
                <dt>{formatLabel(key)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          {index < files.length - 1 && (
            <div className="vads-u-margin-bottom--3" />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ReviewField;
