import React from 'react';

const HeaderLayout = () => {
  return (
    <div className="vads-l-row vads-u-justify-content--space-between">
      <div className="vads-l-col small-screen:vads-l-col--12 medium-screen:vads-l-col--6">
        <h1>My HealtheVet</h1>
        <div className="va-introtext">
          <p>
            Welcome to My HealtheVet on VA.gov&mdash;where you can manage your
            VA health care and your health.
          </p>
          <p>
            <a href="/resources/my-healthevet-on-vagov-what-to-know">
              Learn more about My HealtheVet on VA.gov
            </a>
          </p>
        </div>
      </div>
      <div className="vads-u-display--none medium-screen:vads-u-display--block vads-l-col--6">
        <img
          src="/img/mhv-logo.png"
          className="mhv-logo vads-u-display--block vads-u-margin-left--auto vads-u-margin-top--6"
          alt="My HealtheVet Logo"
        />
      </div>
    </div>
  );
};

export default HeaderLayout;
