import PropTypes from 'prop-types';
import React from 'react';
import PoaRequestsTable from '../components/PoaRequestsTable/PoaRequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';
import LoginViewWrapper from './LoginViewWrapper';

import { POAbreadcrumbs } from '../common/breadcrumbs';

const POARequests = ({ POApermissions = true }) => {
  const POABreadcrumbs = POAbreadcrumbs('poa-requests');

  return (
    <LoginViewWrapper
      breadcrumbs={POABreadcrumbs}
      POApermissions={POApermissions}
    >
      <h1>Power of attorney requests</h1>
      <PoaRequestsTable poaRequests={mockPOARequests} />
    </LoginViewWrapper>
  );
};

POARequests.propTypes = {
  POApermissions: PropTypes.bool,
};

export default POARequests;
