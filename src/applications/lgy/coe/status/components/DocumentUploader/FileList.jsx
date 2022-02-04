import React from 'react';
import PropTypes from 'prop-types';
import FileListItem from './FileListItem';

const FileList = ({ files, onClick }) => (
  <>
    {files.map((file, index) => (
      <FileListItem key={index} file={file} index={index} onClick={onClick} />
    ))}
  </>
);

FileList.propTypes = {
  files: PropTypes.array,
  onClick: PropTypes.func,
};

export default FileList;
