import React from 'react';

import { URLS } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';

const UpdateInformationQuestion = props => {
  const goToNextPage = url => {
    const { router } = props;
    router.push(url);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <fieldset>
        <legend>
          <h1 tabIndex="-1">
            Need to update your insurance, contact, or other information?
          </h1>
        </legend>
        <button
          data-testid="yes-button"
          className="usa-button-secondary usa-button-big"
          onClick={() => goToNextPage(URLS.SEE_STAFF)}
        >
          Yes
        </button>
        <button
          data-testid="no-button"
          className="usa-button-secondary usa-button-big"
          onClick={() => goToNextPage(URLS.UPDATE_INSURANCE)}
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
