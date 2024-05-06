import React from 'react';

const POAPermissionsError = () => (
  <va-alert data-testid="poa-permissions-error" status="error" visible>
    <h2 data-testid="poa-permissions-error-heading" slot="headline">
      You are missing some permissions
    </h2>
    <div>
      <p
        data-testid="poa-permissions-error-description"
        className="vads-u-margin-y--0"
      >
        In order to access the features of the Accredited Representative Portal
        you need to have certain permissions, such as being registered with the
        VA to accept Power of Attorney for a Veteran.
      </p>
    </div>
  </va-alert>
);

export default POAPermissionsError;
