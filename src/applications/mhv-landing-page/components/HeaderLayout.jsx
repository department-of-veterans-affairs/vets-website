import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { datadogRum } from '@datadog/browser-rum';
import WelcomeContainer from '../containers/WelcomeContainer';

const goBackLinkText = 'Go back to the previous version of My HealtheVet';

const HeaderLayout = ({
  showWelcomeMessage = false,
  showMhvGoBack = false,
  ssoe = false,
}) => {
  const mhvHomeUrl = mhvUrl(ssoe, 'home');

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
          <div className="vads-l-col">
            <div className="vads-l-row">
              <div className="vads-l-col-6 ">
                <h1 className="vads-u-margin-y--0">My HealtheVet</h1>
              </div>
              <div className="vads-l-col-2 vads-u-margin-left--2 vads-u-margin-top--2">
                <span className="usa-label vads-u-background-color--primary">
                  New
                </span>
              </div>
            </div>
          </div>
          <div className="va-introtext">
            <p>
              Welcome to the new home for My HealtheVet. Now you can manage your
              health care needs in the same place where you manage your other VA
              benefits and services—right here on VA.gov.
            </p>
            {showMhvGoBack && (
              <p>
                If you’re not ready to try the new My HealtheVet, you can use
                the previous version anytime.{' '}
                <a
                  onClick={() =>
                    datadogRum.addAction(
                      `Click on Landing Page: Intro - ${goBackLinkText}`,
                    )
                  }
                  data-testid="mhv-go-back-1"
                  href={mhvHomeUrl}
                >
                  {goBackLinkText}
                </a>
              </p>
            )}
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
      {showWelcomeMessage && (
        <div
          className={classnames(
            'vads-u-border-color--gray-light',
            'vads-u-border-bottom--1px',
            'vads-u-margin-bottom--3',
          )}
        >
          <WelcomeContainer />
        </div>
      )}
    </>
  );
};

HeaderLayout.propTypes = {
  showMhvGoBack: PropTypes.bool,
  showWelcomeMessage: PropTypes.bool,
  ssoe: PropTypes.bool,
};

export default HeaderLayout;
