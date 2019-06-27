import React from 'react';

function Vet360ProfileFieldHeading({ children, editTarget, onEditClick }) {
  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{children}</h3>{' '}
      {onEditClick && (
        <button
          type="button"
          data-action="edit"
          data-edit-target={editTarget}
          onClick={onEditClick}
          className="va-button-link va-profile-btn"
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default Vet360ProfileFieldHeading;
