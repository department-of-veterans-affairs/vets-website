import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import {
  dateFormat,
  rxSourceIsNonVA,
  isOracleHealthPrescription,
} from '../../util/helpers';
import {
  DATETIME_FORMATS,
  dispStatusObj,
  dispStatusObjV2,
  DISPENSE_STATUS,
} from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';
import RefillButton from './RefillButton';
import SendRxRenewalMessage from './SendRxRenewalMessage';
import { pageType } from '../../util/dataDogConstants';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';

const ExtraDetails = ({ showRenewalLink = false, page, ...rx }) => {
  const { dispStatus, refillRemaining } = rx;
  const pharmacyPhone = pharmacyPhoneNumber(rx);
  const cernerFacilityIds = useSelector(selectCernerFacilityIds);
  const noRefillRemaining =
    refillRemaining === 0 && dispStatus === DISPENSE_STATUS.ACTIVE;
  const isOracleHealth = isOracleHealthPrescription(rx, cernerFacilityIds);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const useV2Status = isCernerPilot && isV2StatusMapping;

  const refillButton = page === pageType.LIST ? <RefillButton {...rx} /> : null;

  const renderV2Content = () => {
    switch (dispStatus) {
      case dispStatusObjV2.statusNotAvailable:
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

      case dispStatusObjV2.inprogress:
        // Both map to "In progress" in V2
        return (
          <div
            className="statusIcon refillProcessIcon"
            data-testid="refill-in-process"
          >
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              isOracleHealth={isOracleHealth}
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

      case dispStatusObjV2.active:
        // Both map to "Active" in V2
        if (noRefillRemaining) {
          return (
            <div className="no-print">
              <p
                className="vads-u-margin-y--0"
                data-testid="active-no-refill-left"
              >
                {isOracleHealth
                  ? 'You can’t refill this prescription. If you need more, send a secure message to your care team.'
                  : 'You can’t refill this prescription. Contact your VA provider if you need more of this medication.'}
              </p>
              <SendRxRenewalMessage
                rx={rx}
                showFallBackContent={showRenewalLink}
                isOracleHealth={isOracleHealth}
              />
            </div>
          );
        }
        return refillButton;

      case dispStatusObjV2.inactive:
        // All map to "Inactive" in V2
        return (
          <div>
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              isOracleHealth={isOracleHealth}
              fallbackContent={
                <>
                  <p className="vads-u-margin-y--0" data-testid="inactive">
                    You can’t refill this prescription. Contact your VA provider
                    if you need more of this medication.
                  </p>
                </>
              }
            />
          </div>
        );

      case dispStatusObjV2.expired:
        return (
          <div>
            <p className="vads-u-margin-y--0" data-testid="expired">
              You can’t refill this prescripition. Contact your VA provider if
              you need more of this medicaton.
            </p>
          </div>
        );

      case dispStatusObjV2.transferred:
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

      case dispStatusObjV2.nonVA:
        return (
          <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
            You can’t manage this medication in this online tool.
          </p>
        );

      default:
        return null;
    }
  };

  const renderV1Content = () => {
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
              isOracleHealth={isOracleHealth}
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
              isOracleHealth={isOracleHealth}
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
          <div className="vads-u-width--full">
            <p className="vads-u-margin-y--0" data-testid="active-parked">
              You can request this prescription when you need it.
            </p>
            {refillButton}
          </div>
        );

      case dispStatusObj.expired:
        return (
          <div>
            <SendRxRenewalMessage
              rx={rx}
              showFallBackContent={showRenewalLink}
              isOracleHealth={isOracleHealth}
              fallbackContent={
                <>
                  <p className="vads-u-margin-y--0" data-testid="expired">
                    You can’t refill this prescription. Contact your VA provider
                    if you need more of this medication.
                  </p>
                </>
              }
            />
          </div>
        );

      case dispStatusObj.discontinued:
        return (
          <div>
            <p className="vads-u-margin-y--0" data-testid="discontinued">
              You can’t refill this prescription. Contact your VA provider if
              you need more of this medication.
            </p>
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

      case dispStatusObj.nonVA:
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
            You can’t refill this prescription. Contact your VA provider if you
            need more of this medication.
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
                You can’t refill this prescription. Contact your VA provider if
                you need more of this medication.
              </p>
              <SendRxRenewalMessage
                rx={rx}
                showFallBackContent={showRenewalLink}
                isOracleHealth={isOracleHealth}
              />
            </div>
          );
        }
        return refillButton;

      default:
        return null;
    }
  };

  const renderContent = () => {
    // Handle Non-VA prescriptions first
    if (rxSourceIsNonVA(rx)) {
      return (
        <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
          You can’t manage this medication in this online tool.
        </p>
      );
    }

    // V2 status handling when both flags are enabled
    if (useV2Status) {
      return renderV2Content();
    }

    // V1 (legacy) status handling
    return renderV1Content();
  };

  const content = renderContent();

  if (!content) {
    return null;
  }

  return (
    <div
      className="shipping-info"
      id={`status-description-${rx.prescriptionId}`}
    >
      {content}
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
