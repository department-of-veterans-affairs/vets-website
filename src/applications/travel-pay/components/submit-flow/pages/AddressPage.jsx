import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import { selectVAPResidentialAddress } from 'platform/user/selectors';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { HelpTextOptions, HelpTextModalities } from '../../HelpText';
import SmocRadio from '../../SmocRadio';
import {
  recordSmocButtonClick,
  recordSmocPageview,
} from '../../../util/events-helpers';

const AddressPage = ({
  address,
  pageIndex,
  setPageIndex,
  yesNo,
  setYesNo,
  setIsUnsupportedClaimType,
}) => {
  const title = !address
    ? 'We can’t file this claim in this tool at this time'
    : 'Did you travel from your home address?';

  useSetPageTitle(title);

  useEffect(
    () => {
      recordSmocPageview('address');
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
      recordSmocButtonClick('address', 'continue');
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
      recordSmocButtonClick('address', 'back');
      setPageIndex(pageIndex - 1);
    },
  };

  if (!address) {
    return (
      <>
        <h1 className="vads-u-margin-bottom--2">{title}</h1>
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
        <br />
        <va-button
          back
          disable-analytics
          onClick={handlers.onBack}
          class="vads-u-margin-y--2"
        />
      </>
    );
  }

  return (
    <div>
      <SmocRadio
        name="address"
        value={yesNo.address}
        error={requiredAlert}
        label={title}
        description={`Answer “yes” if you traveled from the address listed here and you confirm that it’s not a Post Office box. Home address. ${
          address.addressLine1
        } ${address.addressLine2 ?? ''} ${address.addressLine3 ?? ''} ${
          address.city
        }, ${address.stateCode} ${address.zipCode}`}
        onValueChange={e => {
          setYesNo({ ...yesNo, address: e.detail.value });
        }}
      >
        <div className="vads-u-margin-y--2">
          <p>
            Answer “yes” if you traveled from the address listed here and you
            confirm that it’s not a Post Office box.
          </p>
          <hr aria-hidden="true" className="vads-u-margin-y--0" />
          <div className="vads-u-margin-y--2">
            <strong>Home address</strong>
            <div data-dd-privacy="mask">
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
            </div>
          </div>
          <hr aria-hidden="true" className="vads-u-margin-y--0" />
        </div>
      </SmocRadio>
      <HelpTextOptions
        dataTestId="address-help-text"
        trigger="If you didn't travel from your home address"
        headline="If you traveled from a different address, you can’t file a claim in this tool right now."
      />
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        disable-analytics
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
