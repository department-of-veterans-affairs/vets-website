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
          'vads-u-align-items--flex-start',
        )}
      >
        <div className="vads-l-col medium-screen:vads-l-col--8">
          <h1>My HealtheVet</h1>
          <div className="va-introtext">
            <p>
              Welcome to the new home for My HealtheVet. Now you can manage your
              health care needs in the same place where you manage your other VA
              benefits and services—right here on VA.gov.
            </p>
            <p>
              If you’re not ready to try the new My HealtheVet, you can use the
              previous version anytime.{' '}
              <a href="https://www.myhealth.va.gov/mhv-portal-web/home">
                Go back to the previous version of My HealtheVet
              </a>
            </p>
          </div>
          <div>
            <va-alert-expandable
              status="info"
              trigger="Learn more about My HealtheVet on VA.gov "
            >
              <div>
                <p>
                  <strong>What you can do now on VA.gov:</strong>
                </p>
                <ul>
                  <li>Schedule, cancel, and manage some health appointments</li>
                  <li>Send secure messages to your health care team</li>
                  <li>
                    Refill your prescriptions and get a list of all your
                    medications
                  </li>
                </ul>
                <p>
                  <strong>What’s coming soon:</strong>
                </p>
                <ul>
                  <li>Find, print, and download your medical records</li>
                  <li>Get your lab and test results</li>
                </ul>
                <p>
                  We’re working to bring your medical records to VA.gov. For
                  now, you can download your records using the previous version
                  of My HealtheVet.{' '}
                  <a href="https://www.myhealth.va.gov/mhv-portal-web/home">
                    Go back to the previous version of My HealtheVet
                  </a>
                </p>
              </div>
            </va-alert-expandable>
          </div>
        </div>
        <div
          className={classnames(
            'vads-u-display--none',
            'medium-screen:vads-u-display--block',
            'vads-l-col--4',
            'vads-u-text-align--right',
            'vads-u-margin-y--2p5',
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
