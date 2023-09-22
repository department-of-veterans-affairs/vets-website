import React from 'react';

const Edit = ({
  givenName,
  familyName,
  primaryPhone,
  handleSave,
  handleCancel,
}) => {
  return (
    <form>
      <div>
        <h3>Name</h3>
        <va-text-input label="First name" name="givenName" value={givenName} />
        <va-text-input label="Last name" name="familyName" value={familyName} />
      </div>

      <div>
        <h3>Phone</h3>
        <va-text-input label="Phone" name="primaryPhone" value={primaryPhone} />
      </div>

      <div>
        <va-button text="Save" onClick={handleSave} />
        <va-button secondary text="Cancel" onClick={handleCancel} />
      </div>
    </form>
  );
};

export default Edit;
