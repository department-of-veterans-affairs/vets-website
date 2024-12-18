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
    <div className="vads-u-margin--3">
      <VaRadio
        use-forms-pattern="single"
        form-heading="Did you travel in your own vehicle?"
        form-heading-level={1}
        id="mileage"
        onVaValueChange={e => setYesNo({ ...yesNo, vehicle: e.detail.value })}
        value={yesNo.vehicle}
        data-testid="mileage-test-id"
        error={null}
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
        className="vads-u-margin-top--3"
        trigger="If you didn't travel in your own vehicle"
      >
        <p>
          <strong>
            If you traveled by bus, train, taxi, or other authorized public
            transportation, you can’t file a claim in this tool right now.
          </strong>{' '}
          But you can file your claim online, within 30 days, through the
          <va-link
            external
            href="https://link-to-btsss"
            text="Beneficiary Travel Self Service System (BTSSS)"
          />
          . Or you can use VA Form 10-3542 to submit a claim by mail or in
          person.
        </p>
      </va-additional-info>

      {requiredAlert && (
        <va-alert
          class="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          slim
          status="error"
          visible="true"
        >
          <>
            <p className="vads-u-margin-y--0">
              You must make a selection to continue.
            </p>
          </>
        </va-alert>
      )}
      <VaButtonPair
        class="vads-u-margin-top--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default VehiclePage;
