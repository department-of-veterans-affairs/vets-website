import React from 'react';

const PermissionsPage = () => {
  return (
    <>
      <h1 data-testid="permissions-page-heading">Permissions</h1>
      <va-button
        data-testid="permissions-page-add-button"
        text="Add"
        secondary
      />
      <va-button
        data-testid="permissions-page-upload-csv-button"
        text="Upload CSV"
        secondary
      />
      <div className="placeholder-container">
        <div className="vads-u-background-color--gray-lightest vads-u-margin-bottom--2 vads-u-height--viewport" />
      </div>
    </>
  );
};

export default PermissionsPage;
