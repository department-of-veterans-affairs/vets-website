import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import { VaIcon } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dateFormat, rxSourceIsNonVA } from '../../util/helpers';
import {
  DATETIME_FORMATS,
  dispStatusObj,
  dispStatusObjV2,
  DISPENSE_STATUS,
} from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';
import SendRxRenewalMessage from './SendRxRenewalMessage';
import { pageType } from '../../util/dataDogConstants';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';

const ExtraDetails = ({ showRenewalLink = false, ...rx }) => {
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const useV2Statuses = isCernerPilot && isV2StatusMapping;

  const { dispStatus, refillRemaining } = rx;
  const pharmacyPhone = pharmacyPhoneNumber(rx);
  const noRefillRemaining =
    refillRemaining === 0 && dispStatus === DISPENSE_STATUS.ACTIVE;

  const renderV1Content = () => {
    return (
      <>
        {dispStatus === dispStatusObj.unknown && (
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
        )}

        {dispStatus === dispStatusObj.refillinprocess && (
          <div
            className="statusIcon refillProcessIcon"
            data-testid="refill-in-process"
          >
            <SendRxRenewalMessage
              rx={rx}
              alwaysShowFallBackContent={showRenewalLink}
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
        )}
        {dispStatus === dispStatusObj.submitted && (
          <div
            className="statusIcon submittedIcon"
            data-testid="submitted-refill-request"
          >
            <SendRxRenewalMessage
              rx={rx}
              alwaysShowFallBackContent={showRenewalLink}
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
        )}
        {dispStatus === dispStatusObj.activeParked && (
          <p className="vads-u-margin-y--0" data-testid="active-parked">
            You can request this prescription when you need it.
          </p>
        )}
        {dispStatus === dispStatusObj.expired && (
          <div>
            <SendRxRenewalMessage
              rx={rx}
              alwaysShowFallBackContent={showRenewalLink}
              fallbackContent={
                <p className="vads-u-margin-y--0" data-testid="expired">
                  You can’t refill this prescription. Contact your VA provider
                  if you need more of this medication.
                </p>
              }
            />
          </div>
        )}
        {dispStatus === dispStatusObj.discontinued && (
          <div>
            <p className="vads-u-margin-y--0" data-testid="discontinued">
              You can’t refill this prescription. Contact your VA provider if
              you need more of this medication.
            </p>
          </div>
        )}
        {dispStatus === dispStatusObj.transferred && (
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
        )}
        {(dispStatus === dispStatusObj.nonVA || rxSourceIsNonVA(rx)) && (
          <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
            You can’t manage this medication in this online tool.
          </p>
        )}
        {dispStatus === dispStatusObj.onHold && (
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
        )}
        {dispStatus === dispStatusObj.active &&
          noRefillRemaining && (
            <div className="no-print">
              <p
                className="vads-u-margin-y--0"
                data-testid="active-no-refill-left"
              >
                You have no refills left. If you need more, request a renewal.
              </p>
              <SendRxRenewalMessage
                rx={rx}
                alwaysShowFallBackContent={showRenewalLink}
                fallbackContent={
                  <va-link
                    href="/resources/how-to-renew-a-va-prescription"
                    text="Learn how to renew prescriptions"
                    data-testid="learn-to-renew-prescriptions-link"
                  />
                }
              />
            </div>
          )}
      </>
    );
  };

  const renderV2Content = () => {
    return (
      <>
        {dispStatus === dispStatusObjV2.statusNotAvailable && (
          <div
            className="statusIcon unknownIcon"
            data-testid="status-not-available"
          >
            <va-icon icon="warning" size={4} aria-hidden="true" />
            <div
              className="vads-u-padding-left--2"
              data-testid="status-not-available-rx"
            >
              <p className="vads-u-margin-y--0">
                There’s a problem with our system. You can’t manage this
                prescription online right now.
              </p>
              <p className="vads-u-margin-y--0">
                If you need this prescription now, call your VA pharmacy
                <CallPharmacyPhone
                  cmopDivisionPhone={pharmacyPhone}
                  page={pageType.DETAILS}
                />
              </p>
            </div>
          </div>
        )}
        {dispStatus === dispStatusObjV2.refillinprocess && (
          <div
            className="statusIcon refillProcessIcon"
            data-testid="in-progress"
          >
            <SendRxRenewalMessage
              rx={rx}
              alwaysShowFallBackContent={showRenewalLink}
              fallbackContent={
                <>
                  <VaIcon size={3} icon="acute" aria-hidden="true" />
                  <div
                    className="vads-u-padding-left--2"
                    data-testid="rx-in-progress"
                  >
                    <p className="vads-u-margin-y--0">
                      If you need your medication sooner, call your VA
                      pharmacy’s automated refill line.
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
        )}
        {dispStatus === dispStatusObjV2.expired && (
          <div>
            <SendRxRenewalMessage
              rx={rx}
              alwaysShowFallBackContent={showRenewalLink}
              fallbackContent={
                <p className="vads-u-margin-y--0" data-testid="inactive">
                  You can’t refill this prescription. Contact your VA provider
                  if you need more of this medication.
                </p>
              }
            />
          </div>
        )}
        {dispStatus === dispStatusObjV2.transferred && (
          <div>
            <p className="vads-u-margin-y--0" data-testid="transferred-v2">
              This prescription moved to VA’s new electronic health record.
            </p>
          </div>
        )}
        {(dispStatus === dispStatusObjV2.nonVA || rxSourceIsNonVA(rx)) && (
          <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
            You can’t manage this medication in this online tool.
          </p>
        )}
        {dispStatus === dispStatusObjV2.active &&
          noRefillRemaining && (
            <div className="no-print">
              <p
                className="vads-u-margin-y--0"
                data-testid="active-no-refill-left-v2"
              >
                You have no refills left. If you need more, request a renewal.
              </p>
              <SendRxRenewalMessage
                rx={rx}
                alwaysShowFallBackContent={showRenewalLink}
                fallbackContent={
                  <va-link
                    href="/resources/how-to-renew-a-va-prescription"
                    text="Learn how to renew prescriptions"
                    data-testid="learn-to-renew-prescriptions-link"
                  />
                }
              />
            </div>
          )}
      </>
    );
  };

  return (
    <div
      className="shipping-info"
      id={`status-description-${rx.prescriptionId}`}
    >
      {useV2Statuses ? renderV2Content() : renderV1Content()}
    </div>
  );
};

ExtraDetails.propTypes = {
  dispStatus: PropTypes.string,
  expirationDate: PropTypes.string,
  page: PropTypes.string,
  pharmacyPhoneNumber: PropTypes.string,
  prescriptionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  refillDate: PropTypes.string,
  refillRemaining: PropTypes.number,
  refillSubmitDate: PropTypes.string,
  showRenewalLink: PropTypes.bool,
};

export default ExtraDetails;
