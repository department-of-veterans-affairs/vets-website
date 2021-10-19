import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import DemographicItem from '../components/DemographicItem';

const Demographics = props => {
  const { demographics, isLoading, isUpdatePageEnabled, router } = props;

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isUpdatePageEnabled, router],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-demographic-information',
      });
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router],
  );
  if (isLoading) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  }

  const demographicFields = [
    { title: 'Mailing Address', key: 'mailingAddress' },
    { title: 'Home Address', key: 'homeAddress' },
    { title: 'Home Phone', key: 'homePhone' },
    { title: 'Mobile Phone', key: 'mobilePhone' },
    { title: 'Work Phone', key: 'workPhone' },
    { title: 'Email Address', key: 'emailAddress' },
  ];
  if (isLoading) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else if (!demographics) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-demographics">
        <h1>Is this your current contact information?</h1>
        <p className="vads-u-font-family--serif">
          We can better follow up with you after your appointment when we have
          your current information.
        </p>
        <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
          <dl>
            {demographicFields.map(demographicField => (
              <React.Fragment key={demographicField.key}>
                <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                  {demographicField.title}
                </dt>
                <dd>
                  {demographicField.key in demographics &&
                  demographics[demographicField.key] ? (
                    <DemographicItem
                      demographic={demographics[demographicField.key]}
                    />
                  ) : (
                    'Not Available'
                  )}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <button
          onClick={() => yesClick()}
          className={'usa-button-secondary'}
          data-testid="yes-button"
        >
          Yes
        </button>
        <button
          onClick={() => noClick()}
          className="usa-button-secondary vads-u-margin-top--2"
          data-testid="no-button"
        >
          No
        </button>
        <Footer />
        <BackToHome />
      </div>
    );
  }
};

Demographics.propTypes = {
  demographics: PropTypes.object,
  isLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
};

export default Demographics;
