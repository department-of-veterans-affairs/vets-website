import React from 'react';
import PropTypes from 'prop-types';

function VAPServiceProfileFieldHeading({ children, onEditClick, fieldName }) {
  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{children}</h3>{' '}
      {onEditClick && (
        <button
          aria-label={`Edit ${children}`}
          type="button"
          data-action="edit"
          onClick={onEditClick}
          id={`${fieldName}-edit-link`}
          className="va-button-link va-profile-btn"
        >
          Edit
        </button>
      )}
    </div>
  );
}

VAPServiceProfileFieldHeading.propTypes = {
  children: PropTypes.string.isRequired,
  onEditClick: PropTypes.func,
};

export default VAPServiceProfileFieldHeading;
