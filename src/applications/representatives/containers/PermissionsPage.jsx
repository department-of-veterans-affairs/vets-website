import React from 'react';

const PermissionsPage = () => {
  return (
    <>
      <h1>Permissions</h1>
      <va-button
        onClick={function noRefCheck() {}}
        text="Add"
        secondary
        data-testid="permissions-add-button"
      />
      <va-button
        onClick={function noRefCheck() {}}
        text="Upload CSV"
        secondary
        data-testid="permissions-upload-csv-button"
      />
      <div className="placeholder-container">
        <div className="vads-u-background-color--gray-lightest vads-u-margin-bottom--2 vads-u-height--viewport" />
      </div>
    </>
  );
};

export default PermissionsPage;
