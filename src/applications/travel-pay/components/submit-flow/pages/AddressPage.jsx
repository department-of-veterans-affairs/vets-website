import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  VaButtonPair,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { selectVAPResidentialAddress } from 'platform/user/selectors';

import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';
import { BTSSS_PORTAL_URL } from '../../../constants';

const AddressPage = ({
  address,
  pageIndex,
  setPageIndex,
  yesNo,
  setYesNo,
  setIsUnsupportedClaimType,
}) => {
  useEffect(
    () => {
      scrollToTop('topScrollElement');
      if (!address) {
        focusElement('h1');
      } else {
        focusElement('h1', {}, 'va-radio');
      }
    },
    [address],
  );

  const [requiredAlert, setRequiredAlert] = useState(false);

  const handlers = {
    onNext: () => {
      if (!yesNo.address) {
        setRequiredAlert(true);
      } else if (yesNo.address !== 'yes') {
        setIsUnsupportedClaimType(true);
      } else {
        setIsUnsupportedClaimType(false);
        setPageIndex(pageIndex + 1);
      }
    },
    onBack: () => {
      setPageIndex(pageIndex - 1);
    },
  };

  if (!address) {
    return (
      <>
        <h1 className="vads-u-margin-bottom--2">
          We can’t file this claim in this tool at this time
        </h1>
        <va-alert
          close-btn-aria-label="Close notification"
          status="warning"
          visible
        >
          <h2 slot="headline">We need your home address</h2>
          <p className="vads-u-margin-y--1">
            After your home address is in your profile, come back to your
            appointment to start your claim.
          </p>
          <va-link
            href="/profile/contact-information"
            text="Update your address"
          />
        </va-alert>
        <HelpTextModalities />
        <h2 className="vads-u-font-size--h4">
          How can I get help with my claim?
        </h2>
        <HelpTextGeneral />
        <br />
        <va-button back onClick={handlers.onBack} class="vads-u-margin-y--2" />
      </>
    );
  }

  return (
    <div>
      <VaRadio
        id="address"
        onVaValueChange={e => {
          setYesNo({ ...yesNo, address: e.detail.value });
        }}
        value={yesNo.address}
        data-testid="address-test-id"
        error={requiredAlert ? 'You must make a selection to continue.' : null}
        header-aria-describedby={null}
        hint={null}
        label="Did you travel from your home address?"
        label-header-level="1"
      >
        <div className="vads-u-margin-y--2">
          <p>
            Answer “Yes” if you traveled from the address listed here and you
            confirm that it’s not a Post Office box.
          </p>
          <hr className="vads-u-margin-y--0" />
          <p className="vads-u-margin-top--2">
            <strong>Home address</strong>
            <br />
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
          But you can file your claim online through the
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="Beneficiary Travel Self Service System (BTSSS)"
          />
          . Or you can use VA Form 10-3542 to submit a claim by mail or in
          person.
        </p>
      </va-additional-info>
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={handlers.onNext}
        onSecondaryClick={handlers.onBack}
      />
    </div>
  );
};

AddressPage.propTypes = {
  address: PropTypes.object,
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
  setYesNo: PropTypes.func,
  yesNo: PropTypes.object,
};

function mapStateToProps(state) {
  const homeAddress = selectVAPResidentialAddress(state);
  return {
    address: homeAddress,
  };
}

export default connect(mapStateToProps)(AddressPage);
