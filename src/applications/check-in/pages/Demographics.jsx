import React, { useEffect, useCallback } from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

import { goToNextPage, URLS } from '../utils/navigation';

export default function Demographics(props) {
  const { isUpdatePageEnabled, router } = props;
  useEffect(() => {
    focusElement('h1');
  }, []);
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

  return (
    <>
      <h1>Is your contact information correct?</h1>
      <button onClick={() => yesClick()} className={'usa-button-secondary'}>
        Yes
      </button>
      <button onClick={() => noClick()} className={'usa-button-secondary'}>
        No
      </button>
      <Footer />
      <BackToHome />
    </>
  );
}
