import React from 'react';

const HeaderLayout = () => {
  return (
    <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--3">
      <div className="vads-l-col medium-screen:vads-l-col--6">
        <h1>My HealtheVet</h1>
        <div className="va-introtext">
          <p>
            Welcome to My HealtheVet on VA.gov&mdash;where you can manage your
            VA health care and your health.
          </p>
        </div>
      </div>
      <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--5">
        <img
          src="/img/mhv-logo.png"
          className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
          alt="My HealtheVet Logo"
        />
      </div>
    </div>
  );
};

export default HeaderLayout;
