import React from 'react';
import PropTypes from 'prop-types';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dateFormat, rxSourceIsNonVA } from '../../util/helpers';
import {
  DATETIME_FORMATS,
  dispStatusObj,
  DISPENSE_STATUS,
} from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';
import SendRxRenewalMessage from './SendRxRenewalMessage';
import { pageType } from '../../util/dataDogConstants';

const ExtraDetails = ({ showRenewalLink = false, ...rx }) => {
  const { dispStatus, refillRemaining, isRenewable } = rx;
  const pharmacyPhone = pharmacyPhoneNumber(rx);
  const noRefillRemaining =
    refillRemaining === 0 && dispStatus === DISPENSE_STATUS.ACTIVE;

  const renderContent = () => {
    // Handle OH prescriptions with isRenewable first (may have dispStatus or null)
    if (isRenewable && !rxSourceIsNonVA(rx)) {
      return (
        <div className="no-print">
          <SendRxRenewalMessage rx={rx} />
        </div>
      );
    }

    switch (dispStatus) {
      case dispStatusObj.unknown:
        return (
          <div className="statusIcon unknownIcon" data-testid="unknown">
            <va-icon icon="warning" size={4} aria-hidden="true" />
            <div className="vads-u-padding-left--2" data-testid="unknown-rx">
              <p className="vads-u-margin-y--0">
                We’re sorry. There’s a problem with our system. You can’t manage
                this prescription online right now.
              </p>
              <p className="vads-u-margin-y--0">
                Call your VA pharmacy
                <CallPharmacyPhone
                  cmopDivisionPhone={pharmacyPhone}
                  page={pageType.DETAILS}
                />
              </p>
            </div>
          </div>
        );

      case dispStatusObj.refillinprocess:
        return (
          <div
            className="statusIcon refillProcessIcon"
            data-testid="refill-in-process"
          >
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              fallbackContent={
                <>
                  <VaIcon size={3} icon="acute" aria-hidden="true" />
                  <div
                    className="vads-u-padding-left--2"
                    data-testid="rx-process"
                  >
                    <p
                      data-testid="rx-refillinprocess-info"
                      className="vads-u-margin-y--0"
                    >
                      We expect to fill this prescription on{' '}
                      {dateFormat(
                        rx.refillDate,
                        DATETIME_FORMATS.longMonthDate,
                      )}
                      . If you need it sooner, call your VA pharmacy
                      <CallPharmacyPhone
                        cmopDivisionPhone={pharmacyPhone}
                        page={pageType.DETAILS}
                      />
                    </p>
                  </div>
                </>
              }
            />
          </div>
        );

      case dispStatusObj.submitted:
        return (
          <div
            className="statusIcon submittedIcon"
            data-testid="submitted-refill-request"
          >
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              fallbackContent={
                <>
                  <VaIcon size={3} icon="fact_check" aria-hidden="true" />
                  <span className="vads-u-padding-left--2">
                    We got your request on{' '}
                    {dateFormat(
                      rx.refillSubmitDate,
                      DATETIME_FORMATS.longMonthDate,
                    )}
                    . Check back for updates.
                  </span>
                </>
              }
            />
          </div>
        );

      case dispStatusObj.activeParked:
        return (
          <p className="vads-u-margin-y--0" data-testid="active-parked">
            You can request this prescription when you need it.
          </p>
        );

      case dispStatusObj.expired:
        return (
          <div>
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              fallbackContent={
                <>
                  <p className="vads-u-margin-y--0" data-testid="expired">
                    This prescription is too old to refill. If you need more,
                    request a renewal.
                  </p>
                  <va-link
                    href="/resources/how-to-renew-a-va-prescription"
                    text="Learn how to renew prescriptions"
                    data-testid="learn-to-renew-precsriptions-link"
                    data-dd-action-name={
                      dataDogActionNames.detailsPage
                        .LEARN_TO_RENEW_PRESCRIPTIONS_ACTION_LINK
                    }
                  />
                </>
              }
            />
          </div>
        );

      case dispStatusObj.discontinued:
        return (
          <div>
            <p className="vads-u-margin-y--0" data-testid="discontinued">
              You can’t refill this prescription. If you need more, send a
              message to your care team.
            </p>
            <va-link
              href={`${
                environment.BASE_URL
              }/my-health/secure-messages/new-message/`}
              text="Start a new message"
              data-testid="discontinued-compose-message-link"
              data-dd-action-name={
                dataDogActionNames.detailsPage.COMPOSE_A_MESSAGE_LINK
              }
            />
          </div>
        );

      case dispStatusObj.transferred:
        return (
          <div>
            <p className="vads-u-margin-y--0" data-testid="transferred">
              To manage this prescription, go to our My VA Health portal.
            </p>
            <va-link
              href="/"
              text="Go to your prescription in My VA Health"
              data-testid="prescription-VA-health-link"
            />
          </div>
        );

      case dispStatusObj.nonVA || rxSourceIsNonVA(rx):
        return (
          <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
            You can’t manage this medication in this online tool.
          </p>
        );

      case dispStatusObj.onHold:
        return (
          <p
            className="vads-u-margin-y--0 no-print"
            data-testid="active-onHold"
          >
            You can’t refill this prescription online right now. If you need a
            refill, call your VA pharmacy
            <CallPharmacyPhone
              cmopDivisionPhone={pharmacyPhone}
              page={pageType.DETAILS}
            />
          </p>
        );

      case dispStatusObj.active:
        if (noRefillRemaining) {
          return (
            <div className="no-print">
              <p
                className="vads-u-margin-y--0"
                data-testid="active-no-refill-left"
              >
                You have no refills left. If you need more, request a renewal.
              </p>
              <SendRxRenewalMessage
                rx={rx}
                showFallBackContent={showRenewalLink}
                fallbackContent={
                  <va-link
                    href="/resources/how-to-renew-a-va-prescription"
                    text="Learn how to renew prescriptions"
                    data-testid="learn-to-renew-prescriptions-link"
                  />
                }
              />
            </div>
          );
        }
        return null;

      default:
        // Generic fallback for any unhandled dispStatus
        if (rxSourceIsNonVA(rx)) {
          return (
            <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
              You can’t manage this medication in this online tool.
            </p>
          );
        }
        return null;
    }
  };

  return (
    <div
      className="shipping-info"
      id={`status-description-${rx.prescriptionId}`}
    >
      {renderContent()}
    </div>
  );
};

ExtraDetails.propTypes = {
  dispStatus: PropTypes.string,
  expirationDate: PropTypes.string,
  isRenewable: PropTypes.bool,
  page: PropTypes.string,
  pharmacyPhoneNumber: PropTypes.string,
  prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  refillDate: PropTypes.string,
  refillRemaining: PropTypes.number,
  refillSubmitDate: PropTypes.string,
  showRenewalLink: PropTypes.bool,
};

export default ExtraDetails;
