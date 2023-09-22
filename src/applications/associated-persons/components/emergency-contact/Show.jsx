import React from 'react';

const Show = ({
  givenName,
  familyName,
  primaryPhone,
  handleEdit,
  handleRemove,
}) => {
  return (
    <>
      <div>
        <h3>Name</h3>
        {givenName} {familyName}
      </div>

      <div>
        <h3>Phone</h3>
        {primaryPhone}
      </div>

      <div>
        <va-button text="Edit" onClick={handleEdit} />
        <va-button secondary text="Remove" onClick={handleRemove} />
      </div>
    </>
  );
};

export default Show;
