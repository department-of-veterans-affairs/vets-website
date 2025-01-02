import React, { useState } from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const VehiclePage = ({
  pageIndex,
  setPageIndex,
  yesNo,
  setYesNo,
  setCantFile,
}) => {
  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: e => {
      e.preventDefault();
      if (!yesNo.vehicle) {
        setRequiredAlert(true);
      } else if (yesNo.vehicle !== 'yes') {
        setCantFile(true);
      } else {
        setCantFile(false);
        setPageIndex(pageIndex + 1);
      }
    },
    onBack: e => {
      e.preventDefault();
      setPageIndex(pageIndex - 1);
    },
  };

  return (
    <div>
      <VaRadio
        use-forms-pattern="single"
        form-heading="Did you travel in your own vehicle?"
        form-heading-level={1}
        id="vehicle"
        onVaValueChange={e => setYesNo({ ...yesNo, vehicle: e.detail.value })}
        value={yesNo.vehicle}
        data-testid="mileage-test-id"
        error={requiredAlert ? 'You must make a selection to continue.' : null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
      >
        <va-radio-option
          label="Yes"
          value="yes"
          key="vehicle-yes"
          name="vehicle"
          checked={yesNo.vehicle === 'yes'}
        />
        <va-radio-option
          key="vehicle-no"
          name="vehicle"
          checked={yesNo.vehicle === 'no'}
          label="No"
          value="no"
        />
      </VaRadio>

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="If you didn't travel in your own vehicle"
      >
        <p>
          <strong>
            If you traveled by bus, train, taxi, or other authorized public
            transportation, you can’t file a claim in this tool right now.
          </strong>{' '}
          But you can file your claim online, within 30 days, through the{' '}
          <va-link
            external
            href="https://link-to-btsss"
            text="Beneficiary Travel Self Service System (BTSSS)"
          />
          . Or you can use VA Form 10-3542 to submit a claim by mail or in
          person.
        </p>
      </va-additional-info>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default VehiclePage;
