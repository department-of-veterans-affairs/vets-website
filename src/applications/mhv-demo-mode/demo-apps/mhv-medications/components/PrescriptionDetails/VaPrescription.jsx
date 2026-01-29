import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import {
  VaAccordion,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';
import { pharmacyPhoneNumber } from '@department-of-veterans-affairs/mhv/exports';
import {
  dateFormat,
  determineRefillLabel,
  displayProviderName,
  getRefillHistory,
  getShowRefillHistory,
  hasCmopNdcNumber,
  isRefillTakingLongerThanExpected,
  validateIfAvailable,
  prescriptionMedAndRenewalStatus,
} from '../../util/helpers';
import {
  medStatusDisplayTypes,
  DATETIME_FORMATS,
  RX_SOURCE,
  DISPENSE_STATUS,
} from '../../util/constants';
import TrackingInfo from '../shared/TrackingInfo';
import ExtraDetails from '../shared/ExtraDetails';
import SendRxRenewalMessage from '../shared/SendRxRenewalMessage';
import MedicationDescription from '../shared/MedicationDescription';
import {
  selectCernerPilotFlag,
  selectPartialFillContentFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';
import VaPharmacyText from '../shared/VaPharmacyText';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import GroupedMedications from './GroupedMedications';
import CallPharmacyPhone from '../shared/CallPharmacyPhone';
import ProcessList from '../shared/ProcessList';
import { landMedicationDetailsAal } from '../../api/rxApi';
import PrescriptionFillImage from './PrescriptionFillImage';

const VaPrescription = prescription => {
  const showPartialFillContent = useSelector(selectPartialFillContentFlag);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const refillHistory = getRefillHistory(prescription);
  const showRefillHistory = getShowRefillHistory(refillHistory);
  const pharmacyPhone = pharmacyPhoneNumber(prescription);
  const pendingMed =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    prescription?.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    prescription?.dispStatus === DISPENSE_STATUS.RENEW;
  const hasBeenDispensed =
    prescription?.dispensedDate ||
    prescription?.rxRfRecords.find(record => record.dispensedDate);
  const latestTrackingStatus = prescription?.trackingList?.[0];
  const fourteenDaysAgoDate = new Date().setDate(new Date().getDate() - 14);
  const showTrackingAlert =
    latestTrackingStatus?.completeDateTime &&
    Date.parse(latestTrackingStatus?.completeDateTime) > fourteenDaysAgoDate;
  const isRefillRunningLate = isRefillTakingLongerThanExpected(prescription);

  useEffect(
    () => {
      const userLanded = async () => {
        if (prescription) {
          // Check if AAL has already been called for this prescription in this session
          const sessionKey = `aal_called_${prescription.prescriptionId}`;
          const aalAlreadyCalled = sessionStorage.getItem(sessionKey);

          if (!aalAlreadyCalled) {
            try {
              await landMedicationDetailsAal(prescription);
              // Mark that AAL has been called for this prescription in this session
              sessionStorage.setItem(sessionKey, 'true');
            } catch (e) {
              if (window.DD_RUM) {
                const error = new Error(
                  `Error submitting AAL on Medication Details landing. ${e
                    ?.errors?.[0] && JSON.stringify(e?.errors?.[0])}`,
                );
                window.DD_RUM.addError(error);
              }
            }
          }
        }
      };

      userLanded();
    },
    [prescription?.prescriptionId],
  );

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      datadogRum.addAction(dataDogActionNames.detailsPage.REFILLS_ACCORDIAN);
    }
  };

  const stepGuideProps = {
    prescription,
    title: showTrackingAlert
      ? 'Check the status of your next refill'
      : 'Refill request status',
    pharmacyPhone,
    isRefillRunningLate,
  };

  const displayTrackingAlert = () => {
    if (showTrackingAlert) {
      return (
        <>
          {latestTrackingStatus && (
            <TrackingInfo
              {...latestTrackingStatus}
              prescriptionName={prescription.prescriptionName}
            />
          )}
        </>
      );
    }
    return (
      <>
        {latestTrackingStatus && (
          <TrackingInfo
            {...latestTrackingStatus}
            prescriptionName={prescription.prescriptionName}
          />
        )}
      </>
    );
  };

  const getPrescriptionStatusHeading = () => {
    if (!isRefillRunningLate) {
      return '';
    }
    return latestTrackingStatus
      ? 'Check the status of your next refill'
      : 'Refill request status';
  };

  const displayPharmacyContactInfo = () => {
    if (isCernerPilot) {
      return (
        <>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Pharmacy contact information
          </h3>
          <div data-testid="find-facility-link">
            Check your prescription label or contact your VA facility.{' '}
            <a href="https://www.va.gov/find-locations">
              Find your VA facility
            </a>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
          Pharmacy phone number
        </h3>
        <div className="no-print" data-testid="pharmacy-phone">
          {pharmacyPhone ? (
            <>
              <va-telephone
                contact={pharmacyPhone}
                data-testid="phone-number"
              />{' '}
              (<va-telephone tty contact="711" />)
            </>
          ) : (
            validateIfAvailable('Pharmacy phone number')
          )}
        </div>
      </>
    );
  };

  const content = () => {
    if (prescription) {
      return (
        <>
          <div
            className="medication-details-div vads-u-margin-bottom--3"
            data-testid="va-prescription-container"
            data-dd-privacy="mask"
          >
            <SendRxRenewalMessage rx={prescription} isActionLink />
            <>
              {displayTrackingAlert()}

              {isRefillRunningLate && (
                <h2
                  className="vads-u-margin-top--3 vads-u-padding-top--2"
                  data-testid="check-status-text"
                  data-dd-privacy="mask"
                >
                  {getPrescriptionStatusHeading()}
                </h2>
              )}

              {isRefillRunningLate && (
                <VaAlert
                  data-testid="rx-details-refill-alert"
                  status="warning"
                  className="vads-u-margin-bottom--2"
                  uswds
                >
                  <h3
                    slot="headline"
                    className="vads-u-margin-top--0 vads-u-margin-bottom--1"
                  >
                    Your refill request for this medication is taking longer
                    than expected
                  </h3>
                  <p>
                    Call your VA pharmacy{' '}
                    {pharmacyPhone && (
                      <CallPharmacyPhone
                        cmopDivisionPhone={pharmacyPhone}
                        page={pageType.DETAILS}
                      />
                    )}{' '}
                    to check on your refill, if you haven’t received it in the
                    mail yet.
                  </p>
                </VaAlert>
              )}
              <>
                <ProcessList stepGuideProps={stepGuideProps} />
                <div className="vads-u-margin-bottom--3 vads-u-border-top--1px vads-u-border-color--gray-lighter" />
              </>
              <h2
                className="vads-u-margin-top--0 vads-u-margin-bottom--4"
                data-testid="recent-rx"
              >
                {pendingMed || pendingRenewal ? (
                  <>About this prescription</>
                ) : (
                  <>Most recent prescription</>
                )}
              </h2>
              {prescription?.isRefillable && (
                <Link
                  className="vads-u-display--block vads-c-action-link--green vads-u-margin-bottom--3"
                  to="/refill"
                  data-testid="refill-nav-link"
                  data-dd-action-name={
                    dataDogActionNames.detailsPage.FILL_THIS_PRESCRIPTION
                  }
                >
                  {`Request a ${hasBeenDispensed ? 'refill' : 'fill'}`}
                </Link>
              )}

              {prescription && (
                <ExtraDetails
                  {...prescription}
                  page={pageType.DETAILS}
                  showRenewalLink
                />
              )}
              {!pendingMed &&
                !pendingRenewal && (
                  <>
                    <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                      Prescription number
                    </h3>
                    <p data-testid="prescription-number" data-dd-privacy="mask">
                      {prescription.prescriptionNumber}
                    </p>
                  </>
                )}
            </>
            <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
              Status
            </h3>
            {prescriptionMedAndRenewalStatus(
              prescription,
              medStatusDisplayTypes.VA_PRESCRIPTION,
              isCernerPilot,
              isV2StatusMapping,
            )}
            <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
              Refills left
            </h3>
            <p data-testid="refills-left">
              {validateIfAvailable(
                'Number of refills left',
                prescription.refillRemaining,
              )}
            </p>
            {!pendingMed &&
              !pendingRenewal && (
                <>
                  <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                    Request refills by this prescription expiration date
                  </h3>
                  <p data-testid="expiration-date">
                    {dateFormat(
                      prescription.expirationDate,
                      DATETIME_FORMATS.longMonthDate,
                      'Date not available',
                    )}
                  </p>
                </>
              )}
            <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
              Facility
            </h3>
            <p data-testid="facility-name">
              {validateIfAvailable('Facility', prescription.facilityName)}
            </p>
            {displayPharmacyContactInfo()}
            <>
              <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                Instructions
              </h3>
              <p data-testid="rx-instructions">
                {validateIfAvailable('Instructions', prescription?.sig)}
              </p>
              {!isCernerPilot && (
                <>
                  <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                    Reason for use
                  </h3>
                  <p data-testid="rx-reason-for-use">
                    {validateIfAvailable(
                      'Reason for use',
                      prescription?.indicationForUse,
                    )}
                  </p>
                </>
              )}
              <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                Quantity
              </h3>
              <p data-testid="rx-quantity">
                {validateIfAvailable('Quantity', prescription.quantity)}
              </p>
              <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                Prescribed on
              </h3>
              <p data-testid="ordered-date">
                {dateFormat(
                  prescription.orderedDate,
                  DATETIME_FORMATS.longMonthDate,
                  'Date not available',
                )}
              </p>
              <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
                Prescribed by
              </h3>
              <p data-testid="prescribed-by">
                {displayProviderName(
                  prescription?.providerFirstName,
                  prescription?.providerLastName,
                )}
              </p>
            </>
          </div>

          <>
            <div className="medication-details-div vads-u-margin-bottom--3">
              {// Any of the Rx's NDC's will work here. They should all show the same information
              hasCmopNdcNumber(refillHistory) && (
                <Link
                  to={`/prescription/${
                    prescription.prescriptionId
                  }/documentation`}
                  data-testid="va-prescription-documentation-link"
                  className="vads-u-display--inline-block vads-u-font-weight--bold"
                  data-dd-action-name={
                    dataDogActionNames.detailsPage.RX_DOCUMENTATION_LINK
                  }
                >
                  Learn more about this medication
                </Link>
              )}
            </div>
          </>
          {!pendingMed &&
            !isCernerPilot && (
              <div>
                {!pendingRenewal &&
                  showRefillHistory && (
                    <>
                      <h3
                        className="vads-u-margin-top--3"
                        data-testid="refill-History"
                      >
                        Refill history
                      </h3>
                      {refillHistory?.length >= 1 &&
                        hasCmopNdcNumber(refillHistory) && (
                          <p
                            className="vads-u-margin--0"
                            data-testid="note-images"
                          >
                            <strong>Note:</strong> Images on this page are for
                            identification purposes only. They don’t mean that
                            this is the amount of medication you’re supposed to
                            take. If the most recent image doesn’t match what
                            you’re taking, call{' '}
                            <VaPharmacyText phone={pharmacyPhone} />.
                          </p>
                        )}

                      <>
                        <p
                          className="vads-u-margin-top--2 vads-u-margin-bottom--0"
                          data-testid="refill-history-info"
                        >
                          {`Showing ${refillHistory.length} fill${
                            refillHistory.length > 1
                              ? 's, from newest to oldest'
                              : ''
                          }`}
                        </p>
                        <VaAccordion
                          bordered
                          data-testid="refill-history-accordion"
                          uswds
                          onAccordionItemToggled={handleAccordionItemToggle}
                        >
                          {refillHistory.map((entry, i) => {
                            const {
                              shape,
                              color,
                              backImprint,
                              frontImprint,
                            } = entry;
                            const refillPosition = refillHistory.length - i - 1;
                            const refillLabelId = `rx-refill-${refillPosition}`;
                            const isPartialFill =
                              entry.prescriptionSource ===
                              RX_SOURCE.PARTIAL_FILL;
                            const refillLabel = determineRefillLabel(
                              isPartialFill,
                              refillHistory,
                              i,
                            );
                            return (
                              <va-accordion-item
                                data-testid="accordion-fill-date-info"
                                bordered="true"
                                key={i}
                                subHeader={dateFormat(
                                  entry.dispensedDate,
                                  DATETIME_FORMATS.longMonthDate,
                                  'Date not available',
                                  'Filled on ',
                                )}
                              >
                                <h4
                                  className="vads-u-font-size--h6"
                                  data-testid="rx-refill"
                                  id={refillLabelId}
                                  slot="headline"
                                >
                                  {refillLabel}
                                </h4>
                                {showPartialFillContent &&
                                  isPartialFill && (
                                    <>
                                      <p data-testid="partial-fill-text">
                                        This fill has a smaller quantity on
                                        purpose.
                                      </p>
                                      <h5 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans vads-u-margin--0">
                                        Quantity
                                      </h5>
                                      <p
                                        data-testid="rx-quantity-partial"
                                        className="vads-u-margin--0 vads-u-margin-bottom--1"
                                      >
                                        {validateIfAvailable(
                                          'Quantity',
                                          entry.quantity,
                                        )}
                                      </p>
                                    </>
                                  )}
                                {i === 0 &&
                                  !isPartialFill && (
                                    <>
                                      <h5
                                        className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans vads-u-margin--0"
                                        data-testid="shipped-date"
                                      >
                                        Shipped on
                                      </h5>
                                      <p
                                        className="vads-u-margin--0 vads-u-margin-bottom--1"
                                        data-testid="shipped-on"
                                      >
                                        {dateFormat(
                                          prescription?.trackingList
                                            ? prescription.trackingList[0]
                                                ?.completeDateTime
                                            : null,
                                          DATETIME_FORMATS.longMonthDate,
                                          'Date not available',
                                        )}
                                      </p>
                                    </>
                                  )}
                                {!isCernerPilot &&
                                  !isPartialFill && (
                                    <>
                                      <PrescriptionFillImage
                                        prescriptionFill={entry}
                                        isFirstFill={i === 0}
                                      />
                                      <h5
                                        className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                                        data-testid="med-description"
                                      >
                                        Medication description
                                      </h5>
                                      <div data-testid="rx-description">
                                        <MedicationDescription
                                          shape={shape}
                                          color={color}
                                          frontImprint={frontImprint}
                                          backImprint={backImprint}
                                          pharmacyPhone={pharmacyPhone}
                                        />
                                      </div>
                                    </>
                                  )}
                              </va-accordion-item>
                            );
                          })}
                        </VaAccordion>
                      </>
                    </>
                  )}
                {prescription?.groupedMedications?.length > 0 && (
                  <GroupedMedications
                    groupedMedicationsList={prescription.groupedMedications}
                  />
                )}
              </div>
            )}
        </>
      );
    }
    return (
      <va-loading-indicator
        message="Loading your medication record..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return <div>{content()}</div>;
};

VaPrescription.propTypes = {
  prescription: PropTypes.object,
};

export default VaPrescription;
