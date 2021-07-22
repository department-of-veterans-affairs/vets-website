import React, { useEffect } from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import { URLS, goToNextPage } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import { createAnalyticsSlug } from '../utils/analytics';

const UpdateInformationQuestion = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const { router } = props;

  const noButtonClicked = () => {
    recordEvent({
      event: createAnalyticsSlug('no-button-clicked'),
    });
    goToNextPage(router, URLS.DETAILS);
  };

  const yesButtonClicked = () => {
    recordEvent({
      event: createAnalyticsSlug('yes-button-clicked'),
    });
    goToNextPage(router, URLS.SEE_STAFF);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 update-information">
      <h1 tabIndex="-1" className="question">
        Check in at VA
      </h1>
      <fieldset>
        <legend>
          <h2>Do you need to update any information?</h2>
          <p>
            This includes information like your phone number, address, insurance
            plan, or next-of-kin.
          </p>
        </legend>
        <button
          data-testid="yes-button"
          className="usa-button-secondary usa-button-big"
          onClick={() => yesButtonClicked()}
        >
          Yes
        </button>
        <button
          data-testid="no-button"
          className="usa-button-secondary usa-button-big"
          onClick={() => noButtonClicked()}
        >
          No
        </button>
      </fieldset>

      <Footer />
      <BackToHome />
    </div>
  );
};

export default UpdateInformationQuestion;
