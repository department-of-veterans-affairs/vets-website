import PropTypes from 'prop-types';
import React from 'react';
import PoaRequestsTable from '../components/PoaRequestsTable/PoaRequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';
import LoginViewWrapper from './LoginViewWrapper';

import { POABreadcrumbs } from '../common/breadcrumbs';

const POARequests = ({ POAPermissions = true }) => {
  const POAPageBreadcrumbs = POABreadcrumbs('poa-requests');

  return (
    <LoginViewWrapper
      breadcrumbs={POAPageBreadcrumbs}
      POAPermissions={POAPermissions}
    >
      <h1>Power of attorney requests</h1>
      <PoaRequestsTable poaRequests={mockPOARequests} />
    </LoginViewWrapper>
  );
};

POARequests.propTypes = {
  POAPermissions: PropTypes.bool,
};

export default POARequests;
