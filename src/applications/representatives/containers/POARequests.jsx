import React from 'react';
import LoginViewWrapper from './LoginViewWrapper';

const POARequests = () => {
  const breadcrumbs = [
    { link: '/', label: 'Home' },
    { link: '/dashboard', label: 'Dashboard' },
    { link: '/poa-requests', label: 'POA Requests' },
  ];
  return (
    <LoginViewWrapper breadcrumbs={breadcrumbs}>
      <h1>Power of Attorney Requests</h1>
      <label
        htmlFor="poa-requests-search"
        id="poa-requests-search-label"
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
      >
        Search
        <va-text-input
          id="poa-requests-search"
          aria-labelledby="poa-requests-search-label"
          name="preferred-poa-requests-search"
          required
        />
      </label>
      <div className="placeholder-container">
        <div className="nav vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="notif vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="primary vads-u-background-color--gray-lightest vads-u-margin-bottom--2" />
        <div className="etc vads-u-background-color--gray-lightest" />
      </div>
    </LoginViewWrapper>
  );
};

export default POARequests;
