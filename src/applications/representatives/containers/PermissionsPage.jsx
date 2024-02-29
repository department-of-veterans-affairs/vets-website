import React from 'react';
import LoginViewWrapper from './LoginViewWrapper';

import { POAbreadcrumbs } from '../common/breadcrumbs';

const PermissionsPage = () => {
  const permissionsBreadcrumbs = POAbreadcrumbs('permissions');
  return (
    <LoginViewWrapper breadcrumbs={permissionsBreadcrumbs} POApermissions>
      <h1>Permissions</h1>
      <va-button onClick={function noRefCheck() {}} text="Add" secondary />
      <va-button
        onClick={function noRefCheck() {}}
        text="Upload CSV"
        secondary
      />
      <div className="placeholder-container">
        <div className="vads-u-background-color--gray-lightest vads-u-margin-bottom--2 vads-u-height--viewport" />
      </div>
    </LoginViewWrapper>
  );
};

export default PermissionsPage;
