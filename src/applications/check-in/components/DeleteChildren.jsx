import React from 'react';
import PropTypes from 'prop-types';

const DeleteChildren = ({ isDeleted, children }) => {
  return <>{isDeleted ? <del>{children}</del> : children}</>;
};

DeleteChildren.propTypes = {
  children: PropTypes.node.isRequired,
  isDeleted: PropTypes.bool.isRequired,
};

export default DeleteChildren;
