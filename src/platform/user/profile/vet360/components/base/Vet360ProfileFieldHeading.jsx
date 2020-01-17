import React from 'react';
import PropTypes from 'prop-types';

function Vet360ProfileFieldHeading({ children, onEditClick }) {
  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{children}</h3>{' '}
      {onEditClick && (
        <button
          aria-label={`Edit ${children}`}
          type="button"
          data-action="edit"
          onClick={onEditClick}
          className="va-button-link va-profile-btn"
        >
          Edit
        </button>
      )}
    </div>
  );
}

Vet360ProfileFieldHeading.propTypes = {
  children: PropTypes.string.isRequired,
  onEditClick: PropTypes.func,
};

export default Vet360ProfileFieldHeading;
