import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
import { selectSecureMessagingMedicationsRenewalRequestFlag } from '../../util/selectors';

const SendRxRenewalMessage = ({
  rx,
  fallbackContent = null,
  suppressRenewalLink = false,
  isActionLink = false,
  isOracleHealth = false,
}) => {
  const showSecureMessagingRenewalRequest = useSelector(
    selectSecureMessagingMedicationsRenewalRequestFlag,
  );
  const redirectPath = encodeURIComponent(
    '/my-health/medications?page=1&rxRenewalMessageSuccess=true',
  );
  const secureMessagesUrl = `/my-health/secure-messages/new-message?prescriptionId=${
    rx.prescriptionId
  }&redirectPath=${redirectPath}`;
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const isExpiredLessThan120Days =
    (rx.dispStatus === 'Expired' || rx.dispStatus === 'Inactive') &&
    rx.expirationDate &&
    new Date(rx.expirationDate) >
      new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
  const { isRenewable } = rx;

  const canSendRenewalRequest = isOracleHealth && isRenewable;

  if (
    !canSendRenewalRequest ||
    !showSecureMessagingRenewalRequest ||
    suppressRenewalLink
  ) {
    return fallbackContent || null;
  }

  const handleOpenModal = () => {
    setShowRenewalModal(true);
    recordEvent({
      event: 'va-modal',
      'modal-title': "You're leaving medications to send a message",
    });
    datadogRum.addAction('Rx Renewal Modal Open');
  };

  const handleContinue = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'Continue to send renewal message',
    });
    datadogRum.addAction('Rx Renewal Modal Continue');
    window.location.href = secureMessagesUrl;
  };

  const handleBack = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'Back from renewal modal',
    });
    datadogRum.addAction('Rx Renewal Modal Back');
    setShowRenewalModal(false);
  };

  const handleClose = () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'Close renewal modal',
    });
    datadogRum.addAction('Rx Renewal Modal Close');
    setShowRenewalModal(false);
  };

  return (
    <>
      <RenderLinkVariation
        isActionLink={isActionLink}
        setShowRenewalModal={handleOpenModal}
        isExpired={isExpiredLessThan120Days}
      />
      <VaModal
        modalTitle="You're leaving medications to send a message"
        primaryButtonText="Continue"
        secondaryButtonText="Back"
        onPrimaryButtonClick={handleContinue}
        onSecondaryButtonClick={handleBack}
        onCloseEvent={handleClose}
        visible={showRenewalModal}
        status="info"
        clickToClose
        uswds
      >
        <p className="vads-u-margin-bottom--2">
          You’ll need to select your provider and send the prescription renewal
          request. We’ll pre-fill your prescription details in the message.
        </p>
        <p className="vads-u-margin-bottom--2">
          If you need a medication immediately, call your VA pharmacy’s
          automated refill line. The phone number is on your prescription label
          or in your medications details page.
        </p>
      </VaModal>
    </>
  );
};

SendRxRenewalMessage.propTypes = {
  fallbackContent: PropTypes.node,
  isActionLink: PropTypes.bool,
  isActiveNoRefills: PropTypes.bool,
  isOracleHealth: PropTypes.bool,
  rx: PropTypes.shape({
    refillRemaining: PropTypes.number,
    dispStatus: PropTypes.string,
    expirationDate: PropTypes.string,
    prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRenewable: PropTypes.bool,
  }),
  suppressRenewalLink: PropTypes.bool,
};

const RenderLinkVariation = ({
  isActionLink,
  setShowRenewalModal,
  isExpired,
}) => {
  return isActionLink ? (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      to="#"
      className="vads-u-display--block vads-c-action-link--green vads-u-margin-bottom--3"
      data-testid="send-renewal-request-message-action-link"
      onClick={() => setShowRenewalModal(true)}
    >
      Send a renewal request message
    </Link>
  ) : (
    <>
      {isExpired && (
        <p
          className="vads-u-margin-y--0"
          data-testid="expired-less-than-120-days"
        >
          You can’t refill this prescription. If you need more, send a secure
          message to your care team.
        </p>
      )}
      <va-link
        href="#"
        text="Send a renewal request message"
        data-testid="send-renewal-request-message-link"
        onClick={() => setShowRenewalModal(true)}
      />
    </>
  );
};

RenderLinkVariation.propTypes = {
  isActionLink: PropTypes.bool,
  isActiveNoRefills: PropTypes.bool,
  isExpired: PropTypes.bool,
  setShowRenewalModal: PropTypes.func,
};

export default SendRxRenewalMessage;
