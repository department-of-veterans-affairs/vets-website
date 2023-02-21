import React from 'react';

const HeaderLayout = () => {
  return (
    <div className="vads-l-row vads-u-justify-content--space-between vads-u-margin-bottom--3">
      <div className="vads-l-col medium-screen:vads-l-col--6">
        <h1>My Health</h1>
        <p>One place to manage your health care &#x2E3A; and your health</p>
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
