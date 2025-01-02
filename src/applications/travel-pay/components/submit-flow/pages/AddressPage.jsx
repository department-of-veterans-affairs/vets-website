import React, { useState } from 'react';
import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AddressPage = ({
  address,
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
      if (!yesNo.address) {
        setRequiredAlert(true);
      } else if (yesNo.address !== 'yes') {
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
        form-heading="Did you travel from your home address?"
        form-heading-level={1}
        id="address"
        onVaValueChange={e => {
          setYesNo({ ...yesNo, address: e.detail.value });
        }}
        value={yesNo.address}
        data-testid="address-test-id"
        error={requiredAlert ? 'You must make a selection to continue.' : null}
        header-aria-describedby={null}
        hint=""
        label=""
        label-header-level=""
      >
        <div slot="form-description">
          <p>
            Answer “Yes” if you traveled from the address listed here and you
            confirm that it’s not a Post Office box.
          </p>
          <hr className="vads-u-margin-y--0" />
          <p className="vads-u-margin-top--2">
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
          <hr className="vads-u-margin-y--0" />
        </div>
        <va-radio-option
          label="Yes"
          value="yes"
          key="address-yes"
          name="address"
          checked={yesNo.address === 'yes'}
        />
        <va-radio-option
          key="address-no"
          name="address"
          checked={yesNo.address === 'no'}
          label="No"
          value="no"
        />
      </VaRadio>

      <va-additional-info
        class="vads-u-margin-y--3"
        trigger="If you didn't travel from your home address"
      >
        <p>
          <strong>
            If you traveled from a different address, you can’t file a claim in
            this tool right now.
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
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default AddressPage;
