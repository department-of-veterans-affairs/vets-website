import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import WelcomeContainer from '../containers/WelcomeContainer';

const HeaderLayout = ({ showWelcomeMessage = false }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showHealthToolsLinks = useToggleValue(
    TOGGLE_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
  );

  const alertExpandableRef = useRef(null);

  useEffect(() => {
    const alertExpandable = alertExpandableRef.current;
    if (alertExpandable) {
      try {
        const style = document.createElement('style');
        style.innerHTML = `
          .alert-expandable-trigger {
            align-items: center !important;
          }
          .alert-expandable-icon {
            vertical-align: middle !important;
          }
        `;
        alertExpandable.shadowRoot.appendChild(style);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Error adding custom styles to alert-expandable component',
          error,
        );
      }
    }
  }, []);

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
                {showHealthToolsLinks && (
                  <span className="usa-label vads-u-background-color--cool-blue">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="va-introtext">
            {showHealthToolsLinks ? (
              <>
                <p>
                  Welcome to the new home for My HealtheVet. Now you can manage
                  your health care needs in the same place where you manage your
                  other VA benefits and services—right here on VA.gov.
                </p>
                <p>
                  If you’re not ready to try the new My HealtheVet, you can use
                  the previous version anytime.{' '}
                  <a href="https://www.myhealth.va.gov/mhv-portal-web/home">
                    Go back to the previous version of My HealtheVet
                  </a>
                </p>
                <div>
                  <va-alert-expandable
                    status="info"
                    ref={alertExpandableRef}
                    trigger="Learn more about My HealtheVet on VA.gov "
                  >
                    <div>
                      <p>
                        <strong>What you can do now on VA.gov:</strong>
                      </p>
                      <ul className="vads-u-font-family--sans">
                        <li>
                          Schedule, cancel, and manage some health appointments
                        </li>
                        <li>Send secure messages to your health care team</li>
                        <li>
                          Refill your prescriptions and get a list of all your
                          medications
                        </li>
                      </ul>
                      <p>
                        <strong>What’s coming soon:</strong>
                      </p>
                      <ul className="vads-u-font-family--sans">
                        <li>Find, print, and download your medical records</li>
                        <li>Get your lab and test results</li>
                      </ul>
                      <p className="vads-u-font-family--sans">
                        We’re working to bring your medical records to VA.gov.
                        For now, you can download your records using the
                        previous version of My HealtheVet.{' '}
                        <a href="https://www.myhealth.va.gov/mhv-portal-web/home">
                          Go back to the previous version of My HealtheVet
                        </a>
                      </p>
                    </div>
                  </va-alert-expandable>
                </div>
              </>
            ) : (
              <p>
                <a href="/resources/my-healthevet-on-vagov-what-to-know">
                  Learn more about My HealtheVet on VA.gov,
                </a>
                &nbsp;where you can manage your VA health care and your health.
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
