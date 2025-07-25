import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

const CopyAddressModalPrompt = ({
  visible,
  onClose,
  homeAddress,
  mailingAddress,
  isLoading,
  onYes,
}) => {
  const onMountCb = useCallback(() => {
    return () => {
      recordCustomProfileEvent({
        title: 'Change Mailing Address',
        status: 'Prompt Shown',
      });
    };
  }, []);

  useEffect(
    () => {
      onMountCb()();
    },
    [onMountCb],
  );

  // content to show based on whether a mailAddress is present or not
  // this edge base may never present itself, but figured it is better to handle the 'what if'
  const MailingAddressInfo = mailingAddress ? (
    <>
      <p>We have this mailing address on file for you:</p>
      <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
        <AddressView data={mailingAddress} />
      </span>{' '}
    </>
  ) : (
    <p>We don’t have a mailing address on file for you.</p>
  );

  const handleClick = btnStatus => {
    return () => {
      recordCustomProfileEvent({
        title: 'Change Mailing Address',
        status: 'Button Click',
        primaryButtonText: btnStatus,
      });
      return btnStatus === 'yes' ? onYes() : onClose();
    };
  };

  return (
    <VaModal
      modalTitle="We've updated your home address"
      visible={visible}
      onClose={onClose}
      onCloseEvent={handleClick('dismiss')}
      data-testid="copy-address-prompt"
      uswds
    >
      <div data-testid="modal-content">
        <p>
          Your updated home address:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={homeAddress} />
          </span>
        </p>
      </div>
      <va-summary-box uswds>
        {MailingAddressInfo}
        Do you want to update your mailing address to match this home address?
        <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
          <AddressView data={homeAddress} />
        </span>
      </va-summary-box>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-top--3">
        <va-button
          loading={isLoading}
          data-action="save-edit"
          data-testid="save-edit-button"
          onClick={handleClick('yes')}
          text={isLoading ? '' : 'Yes'}
          class="vads-u-margin-top--1 vads-u-margin-bottom--1 vads-u-width--full mobile-lg:vads-u-width--auto"
        />

        {!isLoading && (
          <va-button
            data-testid="cancel-edit-button"
            onClick={handleClick('no')}
            text="No"
            class="vads-u-margin-top--1 vads-u-width--full mobile-lg:vads-u-width--auto"
            secondary
          />
        )}
      </div>
    </VaModal>
  );
};

CopyAddressModalPrompt.propTypes = {
  homeAddress: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onYes: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  mailingAddress: PropTypes.object,
  visible: PropTypes.bool,
};

export default CopyAddressModalPrompt;
