import React, { useCallback } from 'react';
import { goToNextPage, URLS } from '../utils/navigation';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

export default function Demographics(props) {
  const { isUpdatePageEnabled, router } = props;
  const yesClick = useCallback(
    () => {
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
