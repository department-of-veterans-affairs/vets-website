import React, { useEffect } from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import { URLS, goToNextPage } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const UpdateInformationQuestion = props => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const { router } = props;

  const noButtonClicked = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'no-to-update-information',
    });
    goToNextPage(router, URLS.DETAILS);
  };

  const yesButtonClicked = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'yes-to-update-information',
    });
    goToNextPage(router, URLS.SEE_STAFF);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 update-information">
      <fieldset>
        <legend>
          <h1>Do you need to update any information?</h1>
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
