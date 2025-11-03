import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router-dom-v5-compat';

const SendRxRenewalMessage = ({
  rx,
  fallbackContent,
  alwaysShowFallBackContent = false,
  isActionLink = false,
}) => {
  const secureMessagesUrl = `/my-health/secure-messages/new-message?prescriptionId=${
    rx.prescriptionId
  }&redirectPath=/my-health/medications?page=1&rxRenualMessageSuccess=true`;
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Determine if the prescription is eligible for a renewal request
  const isActiveNoRefills =
    rx.dispStatus === 'Active' && rx.refillRemaining === 0;
  const isActiveNoRefillsRefillInProcess =
    rx.dispStatus === 'Active: Refill in Process' && rx.refillRemaining === 0;
  const isActiveNoRefillsSubmitted =
    rx.dispStatus === 'Active: Submitted' && rx.refillRemaining === 0;
  const isExpiredLessThan120Days =
    rx.dispStatus === 'Expired' &&
    rx.expirationDate &&
    new Date(rx.expirationDate) >
      new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);

  const canSendRenewalRequest =
    isActiveNoRefills ||
    isActiveNoRefillsRefillInProcess ||
    isActiveNoRefillsSubmitted ||
    isExpiredLessThan120Days;

  if (!canSendRenewalRequest || alwaysShowFallBackContent) {
    return fallbackContent || null;
  }

  return (
    <>
      <RenderLinkVariation
        isActionLink={isActionLink}
        setShowRenewalModal={setShowRenewalModal}
      />
      <VaModal
        modalTitle="You're leaving medications to send a message"
        primaryButtonText="Continue"
        secondaryButtonText="CANCEL"
        onPrimaryButtonClick={() => {
          window.location.href = secureMessagesUrl;
        }}
        onSecondaryButtonClick={() => setShowRenewalModal(false)}
        onCloseEvent={() => setShowRenewalModal(false)}
        visible={showRenewalModal}
        status="success"
        clickToClose
        uswds
      >
        <p className="vads-u-margin-bottom--2">
          You’ll need to select your provider and send them a message requesting
          a prescription renewal.
        </p>
        <p className="vads-u-margin-bottom--2">
          If you need a medication immediately, you should call your VA
          pharmacy’s automated refill line. You can find the pharmacy phone
          number on your prescription label or in your prescription details
          page.
        </p>
      </VaModal>
    </>
  );
};

SendRxRenewalMessage.propTypes = {
  alwaysShowFallBackContent: PropTypes.bool,
  fallbackContent: PropTypes.node,
  isActionLink: PropTypes.bool,
  rx: PropTypes.shape({
    refillRemaining: PropTypes.number,
    dispStatus: PropTypes.string,
    expirationDate: PropTypes.string,
    prescriptionId: PropTypes.string,
  }),
};

const RenderLinkVariation = ({ isActionLink, setShowRenewalModal }) => {
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
    <va-link
      href="#"
      text="Send a renewal request message"
      data-testid="send-renewal-request-message-link"
      onClick={() => setShowRenewalModal(true)}
    />
  );
};

RenderLinkVariation.propTypes = {
  isActionLink: PropTypes.bool,
  setShowRenewalModal: PropTypes.func,
};

export default SendRxRenewalMessage;
