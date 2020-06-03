import React from 'react';
import PropTypes from 'prop-types';

function VAPEditButton({ title, onEditClick, fieldName, className }) {
  return (
    <button
      aria-label={`Edit ${title}`}
      type="button"
      data-action="edit"
      onClick={onEditClick}
      id={`${fieldName}-edit-link`}
      className={className}
    >
      Edit
    </button>
  );
}

VAPEditButton.propTypes = {
  onEditClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default VAPEditButton;
