import React from 'react';
import PropTypes from 'prop-types';
import LoginViewWrapper from './LoginViewWrapper';

import { poaBreadcrumbs } from '../common/breadcrumbs';

const PermissionsPage = () => {
  const permissionsBreadcrumbs = poaBreadcrumbs('permissions');
  return (
    <LoginViewWrapper breadcrumbs={permissionsBreadcrumbs} poaPermissions>
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
  poaPermissions: PropTypes.bool,
};

export default PermissionsPage;
