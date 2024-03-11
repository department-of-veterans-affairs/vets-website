import PropTypes from 'prop-types';
import React from 'react';
import POARequestsTable from '../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';
import LoginViewWrapper from './LoginViewWrapper';

import { poaBreadcrumbs } from '../common/breadcrumbs';

const POARequests = ({ poaPermissions = true }) => {
  const POAPageBreadcrumbs = poaBreadcrumbs('poa-requests');

  return (
    <LoginViewWrapper
      breadcrumbs={POAPageBreadcrumbs}
      poaPermissions={poaPermissions}
    >
      <h1>Power of attorney requests</h1>
      <POARequestsTable poaRequests={mockPOARequests} />
    </LoginViewWrapper>
  );
};

POARequests.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default POARequests;
