import React from 'react';

const HeaderLayoutV1 = () => {
  return (
    <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--4">
      <div className="vads-l-col medium-screen:vads-l-col--6">
        <h1>My HealtheVet</h1>
        <div className="va-introtext vads-u-margin-right--5">
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
          className="mhv-logo vads-u-margin-left--9 vads-u-margin-top--3"
          alt="My HealtheVet Logo"
        />
      </div>
    </div>
  );
};

export default HeaderLayoutV1;
