import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import AddressView from '@@vap-svc/components/AddressField/AddressView';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

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
      recordEvent({
        event: 'profile_modal',
        'modal-title': 'Change Mailing Address',
        'modal-status': 'Prompt Shown',
        'modal-primaryButtonText': 'none',
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
      const eventData = {
        event: 'profile_modal',
        'modal-title': 'Change Mailing Address',
        'modal-status': 'Button Click',
        'modal-primaryButtonText': btnStatus,
      };
      recordEvent(eventData);
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
    >
      <div data-testid="modal-content">
        <p>
          Your updated home address:
          <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
            <AddressView data={homeAddress} />
          </span>
        </p>
      </div>
      <va-featured-content>
        {MailingAddressInfo}
        Do you want to update your mailing address to match this home address?
        <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-y--1p5">
          <AddressView data={homeAddress} />
        </span>
      </va-featured-content>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        <LoadingButton
          data-action="save-edit"
          data-testid="save-edit-button"
          isLoading={isLoading}
          loadingText="Saving changes"
          className="vads-u-margin-top--0"
          onClick={handleClick('yes')}
        >
          Yes
        </LoadingButton>

        {!isLoading && (
          <button
            data-testid="cancel-edit-button"
            type="button"
            className="usa-button-secondary small-screen:vads-u-margin-top--0"
            onClick={handleClick('no')}
          >
            No
          </button>
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
