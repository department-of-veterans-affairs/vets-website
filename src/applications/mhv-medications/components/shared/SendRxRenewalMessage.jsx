import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { selectSecureMessagingMedicationsRenewalRequestFlag } from '../../util/selectors';
import { isOracleHealthPrescription } from '../../util/helpers';

const SendRxRenewalMessage = ({
  rx,
  fallbackContent = null,
  showFallBackContent = false,
  isActionLink = false,
}) => {
  const showSecureMessagingRenewalRequest = useSelector(
    selectSecureMessagingMedicationsRenewalRequestFlag,
  );
  const cernerFacilityIds = useSelector(selectCernerFacilityIds);
  const redirectPath = encodeURIComponent(
    '/my-health/medications?page=1&rxRenewalMessageSuccess=true',
  );
  const secureMessagesUrl = `/my-health/secure-messages/new-message?prescriptionId=${
    rx.prescriptionId
  }&redirectPath=${redirectPath}`;
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  // Determine if the prescription is eligible for a renewal request
  const isActiveNoRefills =
    rx.dispStatus === 'Active' && rx.refillRemaining === 0;
  const isExpiredLessThan120Days =
    rx.dispStatus === 'Expired' &&
    rx.expirationDate &&
    new Date(rx.expirationDate) >
      new Date(Date.now() - 120 * 24 * 60 * 60 * 1000);
  const { isRenewable } = rx;
  const isOracleHealth = isOracleHealthPrescription(rx, cernerFacilityIds);

  const canSendRenewalRequest =
    isOracleHealth &&
    (isRenewable || isActiveNoRefills || isExpiredLessThan120Days);

  if (
    !canSendRenewalRequest ||
    !showSecureMessagingRenewalRequest ||
    showFallBackContent
  ) {
    return fallbackContent || null;
  }

  return (
    <>
      <RenderLinkVariation
        isActionLink={isActionLink}
        setShowRenewalModal={setShowRenewalModal}
        isExpired={isExpiredLessThan120Days}
        isActiveNoRefills={isActiveNoRefills}
      />
      <VaModal
        modalTitle="You're leaving medications to send a message"
        primaryButtonText="Continue"
        secondaryButtonText="Back"
        onPrimaryButtonClick={() => {
          window.location.href = secureMessagesUrl;
        }}
        onSecondaryButtonClick={() => setShowRenewalModal(false)}
        onCloseEvent={() => setShowRenewalModal(false)}
        visible={showRenewalModal}
        status="info"
        clickToClose
        uswds
      >
        <p className="vads-u-margin-bottom--2">
          You’ll need to select your provider and send them a message requesting
          a prescription renewal.
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
  rx: PropTypes.shape({
    refillRemaining: PropTypes.number,
    dispStatus: PropTypes.string,
    expirationDate: PropTypes.string,
    prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRenewable: PropTypes.bool,
  }),
  showFallBackContent: PropTypes.bool,
};

const RenderLinkVariation = ({
  isActionLink,
  setShowRenewalModal,
  isExpired,
  isActiveNoRefills,
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
      {(isExpired || isActiveNoRefills) && (
        <p
          className="vads-u-margin-y--0"
          data-testid={
            isExpired ? 'expired-less-than-120-days' : 'active-no-refills'
          }
        >
          You have no refills left. If you need more, request a renewal.
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
