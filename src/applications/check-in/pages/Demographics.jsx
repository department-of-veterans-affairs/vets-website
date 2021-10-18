import React, { useCallback } from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { goToNextPage, URLS } from '../utils/navigation';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const Demographics = props => {
  const { isUpdatePageEnabled, router, isLoading } = props;

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
  return (
    <>
      <h1>Is your contact information correct?</h1>
      <button
        onClick={() => yesClick()}
        className={'usa-button-secondary'}
        data-testid="yes-button"
      >
        Yes
      </button>
      <button
        onClick={() => noClick()}
        className={'usa-button-secondary'}
        data-testid="no-button"
      >
        No
      </button>
      <Footer />
      <BackToHome />
    </>
  );
};

export default Demographics;
