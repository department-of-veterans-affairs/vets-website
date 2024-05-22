import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import WelcomeContainer from '../containers/WelcomeContainer';

const HeaderLayout = ({ showWelcomeMessage = false }) => {
  return (
    <>
      <div
        className={classnames(
          'vads-u-display--flex',
          'vads-u-justify-content--space-between',
          'vads-u-margin-bottom--2',
          'vads-u-align-items--center',
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
          )}
        >
          <img
            src="/img/mhv-logo.png"
            className="mhv-logo"
            alt="My HealtheVet Logo"
          />
        </div>
      </div>
      <div
        className={classnames(
          'vads-u-border-color--gray-light',
          'vads-u-border-bottom--1px',
          'vads-u-margin-bottom--3',
        )}
      >
        {showWelcomeMessage && <WelcomeContainer />}
      </div>
    </>
  );
};

HeaderLayout.propTypes = {
  showWelcomeMessage: PropTypes.bool,
};

export default HeaderLayout;
