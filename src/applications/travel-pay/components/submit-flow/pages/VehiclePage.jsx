import React from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const VehiclePage = ({ yesNo, setYesNo, onNext, onBack }) => {
  return (
    <div className="vads-u-margin--3">
      <VaRadio
        use-forms-pattern="single"
        form-heading="Did you travel in your own vehicle?"
        form-heading-level={2}
        id="mileage"
        onVaValueChange={e => setYesNo(e.detail.value)}
        data-testid="mileage-test-id"
        error={null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
        required
      >
        <va-radio-option
          label="Yes"
          value
          key="vehicle-yes"
          name="vehicle"
          checked={yesNo === true}
        />
        <va-radio-option
          key="vehicle-no"
          name="vehicle"
          checked={yesNo === false}
          label="No"
          value={false}
        />
      </VaRadio>

      <va-additional-info
        className="vads-u-margin--3"
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

      <VaButtonPair
        class="vads-u-margin-top--2"
        continue
        onPrimaryClick={e => onNext(e)}
        onSecondaryClick={e => onBack(e)}
      />
    </div>
  );
};

export default VehiclePage;
