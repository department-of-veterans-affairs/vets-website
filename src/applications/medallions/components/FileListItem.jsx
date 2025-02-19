import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const formatFileSize = size => {
  if (size < 1024) {
    return `${size} bytes`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const FileListItem = ({ index, file, onClick, editMode, path }) => {
  const _onClick = useCallback(
    () => {
      onClick(index);
    },
    [index, onClick],
  );

  const showButton = editMode || path !== '/review-and-submit';
  return (
    <div
      className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2 vads-u-margin-y--1"
      key={index}
      id={index}
    >
      <p>
        <strong>{file?.fileName}</strong>
      </p>
      <p>{formatFileSize(file?.fileSize)}</p>
      {showButton && (
        <button
          className="usa-button-secondary vads-u-background-color--white vads-u-margin-top--0"
          onClick={_onClick}
          type="button"
        >
          Delete file
        </button>
      )}
    </div>
  );
};

FileListItem.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  file: PropTypes.object,
  editMode: PropTypes.bool,
  path: PropTypes.string,
};

export default FileListItem;
