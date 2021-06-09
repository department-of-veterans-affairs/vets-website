import React, { useState } from 'react';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { goToNextPageWithToken } from '../utils/navigation';

const Insurance = props => {
  const { router } = props;
  const [needToUpdate, setNeedToUpdate] = useState();

  const contactNumber = '555-867-5309';

  const handleContinueClick = () => {
    if (needToUpdate === 'Yes') {
      goToNextPageWithToken(router, 'failed');
    } else if (needToUpdate === 'No') {
      goToNextPageWithToken(router, 'details');
    }
  };

  return (
    <div className={'vads-u-margin--3'}>
      <h1>Need to update your insurance, contact, or other information?</h1>
      <div className="vads-u-margin-bottom--3">
        <RadioButtons
          onValueChange={e => {
            setNeedToUpdate(e.value);
          }}
          options={['Yes', 'No']}
          value={{ value: needToUpdate }}
        />
      </div>
      <button
        type="button"
        className="usa-button"
        onClick={handleContinueClick}
      >
        Continue
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
