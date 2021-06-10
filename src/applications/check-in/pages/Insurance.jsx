import React from 'react';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { goToNextPageWithToken } from '../utils/navigation';

const Insurance = props => {
  const { router } = props;

  const contactNumber = '555-867-5309';

  return (
    <div className={'vads-u-margin--3'}>
      <h1>Need to update your insurance, contact, or other information?</h1>
      <button
        className="usa-button-secondary usa-button-big"
        onClick={() => goToNextPageWithToken(router, 'failed')}
      >
        Yes
      </button>
      <button
        className="usa-button-secondary usa-button-big"
        onClick={() => goToNextPageWithToken(router, 'details')}
      >
        No
      </button>

      <footer className="row">
        <h2 className="help-heading vads-u-font-size--lg">Need help?</h2>
        <p>
          Ask a staff member or call us at <Telephone contact={contactNumber} />
          .
        </p>
      </footer>
    </div>
  );
};

export default Insurance;
