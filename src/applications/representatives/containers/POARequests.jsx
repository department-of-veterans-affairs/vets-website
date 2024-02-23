import PropTypes from 'prop-types';
import React from 'react';

import POARequestsContent from '../components/POARequestsContent/POARequestsContent';
import { mockPOARequests } from '../mocks/mockPOARequests';
import LoginViewWrapper from './LoginViewWrapper';

const breadcrumbs = [
  { link: '/', label: 'Home' },
  { link: '/dashboard', label: 'Dashboard' },
  { link: '/poa-requests', label: 'POA requests' },
];

const POARequests = ({ poaPermissions = true }) => {
  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs} poaPermissions={poaPermissions}>
      <h1>Power of attorney requests</h1>
      <POARequestsContent poaRequests={mockPOARequests} />
    </LoginViewWrapper>
  );
};

POARequests.propTypes = {
  poaPermissions: PropTypes.bool,
};

export default POARequests;
