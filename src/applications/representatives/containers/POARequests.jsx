import PropTypes from 'prop-types';
import React from 'react';
import POARequestsTable from '../components/POARequestsTable/POARequestsTable';
import { mockPOARequests } from '../mocks/mockPOARequests';
import LoginViewWrapper from './LoginViewWrapper';

const POARequests = ({ POApermissions = true }) => {
  const breadcrumbs = [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
    { link: '/poa-requests', label: 'POA requests' },
  ];
  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs} POApermissions={POApermissions}>
      <h1>Power of attorney requests</h1>
      <POARequestsTable poaRequests={mockPOARequests} />
    </LoginViewWrapper>
  );
};

POARequests.propTypes = {
  POApermissions: PropTypes.bool,
};

export default POARequests;
