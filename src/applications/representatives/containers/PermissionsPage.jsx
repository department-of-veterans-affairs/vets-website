import React from 'react';
import PropTypes from 'prop-types';
import LoginViewWrapper from './LoginViewWrapper';

import { POABreadcrumbs } from '../common/breadcrumbs';

const PermissionsPage = () => {
  const permissionsBreadcrumbs = POABreadcrumbs('permissions');
  return (
    <LoginViewWrapper breadcrumbs={permissionsBreadcrumbs} POAPermissions>
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
    </LoginViewWrapper>
  );
};

PermissionsPage.propTypes = {
  POAPermissions: PropTypes.bool,
};

export default PermissionsPage;
