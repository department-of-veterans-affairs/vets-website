import React from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AddressPage = ({ address, yesNo, setYesNo, onNext, onBack }) => {
  return (
    <div className="vads-u-margin--3">
      <VaRadio
        use-forms-pattern="single"
        form-heading="Did you travel from your home address?"
        form-heading-level={2}
        id="address"
        onVaValueChange={e => {
          setYesNo(e.detail.value);
        }}
        data-testid="address-test-id"
        error={null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
        required
      >
        <div slot="form-description">
          <p>
            Answer “Yes” if you traveled from the address listed here and you
            confirm that it’s not a Post Office box.
          </p>
          <hr />
          <p className="vads-u-margin--3">
            {address.addressLine1}
            <br />
            {address.addressLine2 && (
              <>
                {address.addressLine2}
                <br />
              </>
            )}
            {address.addressLine3 && (
              <>
                {address.addressLine3}
                <br />
              </>
            )}
            {`${address.city}, ${address.stateCode} ${address.zipCode}`}
            <br />
          </p>
          <hr />
        </div>
        <va-radio-option
          label="Yes"
          value
          key="address-yes"
          name="address"
          checked={yesNo === true}
        />
        <va-radio-option
          key="address-no"
          name="address"
          checked={yesNo === false}
          label="No"
          value={false}
        />
      </VaRadio>

      <va-additional-info
        className="vads-u-margin--3"
        trigger="If you didn't travel from your home address"
      >
        <p>
          <strong>
            If you traveled from a different address, you can’t file a claim in
            thie tool right now.
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

export default AddressPage;
