import React from 'react';

const HeaderLayout = () => {
  return (
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      <div className="vads-l-col medium-screen:vads-l-col--8">
        <h1>My HealtheVet</h1>
        <div className="va-introtext">
          <p>
            Manage your VA health care and your health.{' '}
            <a href="/resources/my-healthevet-on-vagov-what-to-know">
              Learn more.
            </a>
          </p>
        </div>
      </div>
      <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--4 vads-u-text-align--right">
        <img
          src="/img/mhv-logo.png"
          className="mhv-logo"
          alt="My HealtheVet Logo"
        />
      </div>
    </div>
  );
};

export default HeaderLayout;
