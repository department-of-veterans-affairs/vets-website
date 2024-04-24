import React from 'react';
import classnames from 'classnames';

const HeaderLayout = () => {
  return (
    <div
      className={classnames(
        'vads-u-display--flex',
        'vads-u-justify-content--space-between',
        'vads-u-margin-bottom--2',
        'vads-u-border-color--base',
        'vads-u-border-bottom--1px',
      )}
    >
      <div className="vads-l-col medium-screen:vads-l-col--8">
        <h1>My HealtheVet</h1>
        <div className="va-introtext">
          <p>
            <a href="/resources/my-healthevet-on-vagov-what-to-know">
              Learn more about My HealtheVet on VA.gov,
            </a>
            &nbsp;where you can manage your VA health care and your health.
          </p>
        </div>
      </div>
      <div
        className={classnames(
          'vads-u-display--none',
          'medium-screen:vads-u-display--block',
          'vads-l-col--4',
          'vads-u-text-align--right',
          'vads-u-margin-top--2',
        )}
      >
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
