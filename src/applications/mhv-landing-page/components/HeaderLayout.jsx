import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import recordEvent from '~/platform/monitoring/record-event';
import WelcomeContainer from '../containers/WelcomeContainer';

const learnMoreLink = {
  text: 'Learn more about My HealtheVet on VA.gov',
  href: '/resources/my-healthevet-on-vagov-what-to-know',
};

const ledeContent = `Welcome. You can now manage your health care
  needs in the same place you manage your other VA benefits and services—right
  here on VA.gov. Here, you’ll find new, improved versions of your trusted
  health tools and more features.`;

const HeaderLayout = ({
  showWelcomeMessage = false,
  isCerner = false,
  ssoe = false,
}) => (
  <>
    <div
      className={classnames(
        'vads-u-display--flex',
        'vads-u-justify-content--space-between',
        'vads-u-margin-bottom--2',
        'vads-u-align-items--flex-start',
      )}
      data-testid="mhv-header-layout--milestone-2"
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
        <div>
          <p className="vads-u-font-family--serif vads-u-line-height--5 medium-screen:vads-u-font-size--lg medium-screen:vads-u-line-height--6">
            {ledeContent}
          </p>
          <p className="vads-u-font-family--serif vads-u-line-height--5 medium-screen:vads-u-font-size--lg medium-screen:vads-u-line-height--6">
            Want to learn more about what’s new? <VaLink {...learnMoreLink} />
          </p>
        </div>
        {isCerner && (
          <p>
            If your facility uses My VA Health, go to the My VA Health portal to
            manage your care.
            <br />
            <a
              onClick={() => {
                datadogRum.addAction('Click on My VA Health portal link');
                recordEvent({
                  event: 'nav-link-click',
                  action: 'click',
                  'link-label': 'Go to the My VA Health portal',
                  'link-destination': mhvUrl(ssoe, 'home'),
                  'link-origin': window.location.href,
                });
              }}
              data-testid="mhv-go-back-1"
              href={mhvUrl(ssoe, 'home')}
            >
              Go to the My VA Health portal
            </a>
          </p>
        )}
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

HeaderLayout.propTypes = {
  isCerner: PropTypes.bool,
  showMhvGoBack: PropTypes.bool,
  showWelcomeMessage: PropTypes.bool,
  ssoe: PropTypes.bool,
};

export default HeaderLayout;
