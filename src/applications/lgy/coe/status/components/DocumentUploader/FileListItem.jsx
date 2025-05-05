import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const FileListItem = ({ index, file, onClick }) => {
  const _onClick = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return (
    <div
      className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2 vads-u-margin-y--1"
      key={index}
      id={index}
    >
      <p>
        <strong>{file?.fileName}</strong>
      </p>
      <p>{file?.documentType}</p>
      <button
        className="usa-button-secondary vads-u-background-color--white vads-u-margin-top--0"
        onClick={_onClick}
        type="button"
      >
        Delete file
      </button>
    </div>
  );
};

FileListItem.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  file: PropTypes.object,
};

export default FileListItem;
