import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { datadogRum } from '@datadog/browser-rum';
import { isAuthenticatedWithSSOe } from '../selectors';
import WelcomeContainer from '../containers/WelcomeContainer';

const goBackLinkText = 'Go back to the previous version of My HealtheVet';

const HeaderLayout = ({
  showWelcomeMessage = false,
  showLearnMore = false,
}) => {
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const goBackUrl = mhvUrl(ssoe, 'home');

  const alertExpandableRef = useRef(null);

  const learnMoreAlertTrigger = 'Learn more about My HealtheVet on VA.gov ';

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
                <span className="usa-label vads-u-background-color--cool-blue">
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
            <p>
              If you’re not ready to try the new My HealtheVet, you can use the
              previous version anytime.{' '}
              <a
                onClick={() =>
                  datadogRum.addAction(
                    `Click on Landing Page: Intro - ${goBackLinkText}`,
                  )
                }
                data-testid="mhv-go-back-1"
                href={goBackUrl}
              >
                {goBackLinkText}
              </a>
            </p>
            {showLearnMore && (
              <div>
                <va-alert-expandable
                  status="info"
                  ref={alertExpandableRef}
                  trigger={learnMoreAlertTrigger}
                  data-dd-action-name={learnMoreAlertTrigger}
                  data-testid="learn-more-alert"
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
                      We’re working to bring your medical records to VA.gov. For
                      now, you can download your records using the previous
                      version of My HealtheVet.{' '}
                      <a
                        onClick={() =>
                          datadogRum.addAction(
                            `Click on Landing Page: Learn More - ${goBackLinkText}`,
                          )
                        }
                        data-testid="mhv-go-back-2"
                        href={goBackUrl}
                      >
                        {goBackLinkText}
                      </a>
                    </p>
                  </div>
                </va-alert-expandable>
              </div>
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
  showLearnMore: PropTypes.bool,
  showWelcomeMessage: PropTypes.bool,
};

export default HeaderLayout;
