import React from 'react';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { getFormNumber } from '../helpers';
import FormPage from '../containers/FormPage';

export const IdentificationInfoPage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);

  const { state } = location;

  return (
    <FormPage currentLocation={2} pageTitle="Identification information">
      <p className="vads-u-margin-top--0">
        You must enter either a Social Security number or VA File number.
      </p>
      <div className="vads-u-margin-bottom--5">
        <va-text-input
          hint={null}
          label="Social Security number"
          message-aria-describedby="Optional description text for screen readers"
          name="social-security-number"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
          required
        />
        <va-text-input
          hint={null}
          label="VA file number"
          message-aria-describedby="Optional description text for screen readers"
          name="va-file-number"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
        />
        {/* <VaTextInputField /> */}
      </div>
      <VaButtonPair
        class="vads-u-margin-top--0"
        continue
        onPrimaryClick={() => history.push(`/${formNumber}/review-zip`, state)}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};

export const ZipCodePage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);

  const { state } = location;

  return (
    <FormPage currentLocation={2} pageTitle="Your zip code">
      <p className="vads-u-margin-top--0">
        We use your zip code to send your form to the right place for
        processing.
      </p>
      <div className="vads-u-margin-bottom--5">
        <va-text-input
          hint={null}
          label="Zip code"
          message-aria-describedby="Optional description text for screen readers"
          name="zip-code"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
        />
      </div>
      <VaButtonPair
        class="vads-u-margin-top--0"
        continue
        onPrimaryClick={() => history.push(`/${formNumber}/submit`, state)}
        onSecondaryClick={history.goBack}
        uswds
      />
    </FormPage>
  );
};
