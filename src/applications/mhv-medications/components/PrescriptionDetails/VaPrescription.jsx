import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  VaAccordion,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';
import {
  validateField,
  getImageUri,
  dateFormat,
  createOriginalFillRecord,
  pharmacyPhoneNumber,
  isRefillTakingLongerThanExpected,
} from '../../util/helpers';
import TrackingInfo from '../shared/TrackingInfo';
import FillRefillButton from '../shared/FillRefillButton';
import StatusDropdown from '../shared/StatusDropdown';
import ExtraDetails from '../shared/ExtraDetails';
import {
  selectGroupingFlag,
  selectRefillContentFlag,
  selectRefillProgressFlag,
} from '../../util/selectors';
import VaPharmacyText from '../shared/VaPharmacyText';
import { EMPTY_FIELD } from '../../util/constants';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import GroupedMedications from './GroupedMedications';
import CallPharmacyPhone from '../shared/CallPharmacyPhone';
import ProcessList from '../shared/ProcessList';

const VaPrescription = prescription => {
  const showRefillContent = useSelector(selectRefillContentFlag);
  const showGroupingContent = useSelector(selectGroupingFlag);
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const isDisplayingDocumentation = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
  );
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  const originalFill = createOriginalFillRecord(prescription);
  const pharmacyPhone = pharmacyPhoneNumber(prescription);
  const pendingMed =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'NewOrder';
  const pendingRenewal =
    prescription?.prescriptionSource === 'PD' &&
    prescription?.dispStatus === 'Renew';
  refillHistory.push(originalFill);
  const hasBeenDispensed =
    prescription?.dispensedDate ||
    prescription?.rxRfRecords.find(record => record.dispensedDate);
  const latestTrackingStatus = prescription?.trackingList?.[0];
  const showTrackingAlert =
    prescription?.trackingList?.[0] &&
    prescription?.dispStatus === 'Active: Submitted';
  const isRefillRunningLate = isRefillTakingLongerThanExpected(prescription);

  const determineStatus = () => {
    if (pendingRenewal) {
      return (
        <p data-testid="pending-renewal-status">
          This is a renewal you requested. Your VA pharmacy is reviewing it now.
          Details may change.
        </p>
      );
    }
    if (pendingMed) {
      return (
        <p>
          This is a new prescription from your provider. Your VA pharmacy is
          reviewing it now. Details may change.
        </p>
      );
    }
    return <StatusDropdown status={prescription.dispStatus} />;
  };

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      datadogRum.addAction(dataDogActionNames.detailsPage.GROUPING_ACCORDIAN);
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
    if (showRefillProgressContent && showTrackingAlert) {
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
    if (!showRefillProgressContent) {
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
    return <></>;
  };

  const getPrescriptionStatusHeading = () => {
    if (!isRefillRunningLate) {
      return '';
    }
    return latestTrackingStatus
      ? 'Check the status of your next refill'
      : 'Refill request status';
  };

  const content = () => {
    if (prescription) {
      return (
        <>
          {/* TODO: clean after grouping flag is gone */}
          <div
            className={`${
              !showGroupingContent
                ? 'vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-top--3 medium-screen:vads-u-margin-top--4 '
                : ''
            }medication-details-div vads-u-margin-bottom--3`}
          >
            {/* TODO: clean after grouping flag is gone */}
            {!showGroupingContent && (
              <>
                {displayTrackingAlert()}
                <h2 className="vads-u-margin-top--3 medium-screen:vads-u-margin-top--4 vads-u-margin-bottom--2">
                  About your prescription
                </h2>
                {prescription && <ExtraDetails {...prescription} />}
              </>
            )}
            {/* TODO: clean after refill progress content flag is gone */}
            {!showRefillProgressContent && (
              <>
                {showRefillContent && prescription?.isRefillable ? (
                  <Link
                    // TODO: clean after grouping flag is gone
                    className={`${
                      !showGroupingContent ? 'vads-u-margin-top--3 ' : ''
                    }vads-u-display--block vads-c-action-link--green vads-u-margin-bottom--3`}
                    to="/refill"
                    data-testid="refill-nav-link"
                    data-dd-action-name={
                      dataDogActionNames.detailsPage.FILL_THIS_PRESCRIPTION
                    }
                  >
                    {/* TODO: clean after grouping flag is gone */}
                    {!showGroupingContent &&
                      `${
                        hasBeenDispensed ? 'Refill' : 'Fill'
                      } this prescription`}
                    {showGroupingContent &&
                      `Request a ${hasBeenDispensed ? 'refill' : 'fill'}`}
                  </Link>
                ) : (
                  <FillRefillButton {...prescription} />
                )}
              </>
            )}
            {/* TODO: clean after grouping flag is gone */}
            {showGroupingContent && (
              <>
                {displayTrackingAlert()}

                {isRefillRunningLate && (
                  <h2
                    className="vads-u-margin-top--3 vads-u-padding-top--2 vads-u-border-top--1px vads-u-border-color--gray-lighter"
                    data-testid="check-status-text"
                  >
                    {getPrescriptionStatusHeading()}
                  </h2>
                )}

                {showRefillProgressContent &&
                  isRefillRunningLate && (
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
                        )}
                        to check on your refill, if you haven’t received it in
                        the mail yet.
                      </p>
                    </VaAlert>
                  )}
                {showRefillProgressContent && (
                  <ProcessList stepGuideProps={stepGuideProps} />
                )}
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
                {/* TODO: clean after refill progress content flag is gone */}
                {showRefillProgressContent && (
                  <>
                    {showRefillContent && prescription?.isRefillable ? (
                      <Link
                        // TODO: clean after grouping flag is gone
                        className={`${
                          !showGroupingContent ? 'vads-u-margin-top--3 ' : ''
                        }vads-u-display--block vads-c-action-link--green vads-u-margin-bottom--3`}
                        to="/refill"
                        data-testid="refill-nav-link"
                        data-dd-action-name={
                          dataDogActionNames.detailsPage.FILL_THIS_PRESCRIPTION
                        }
                      >
                        {/* TODO: clean after grouping flag is gone */}
                        {!showGroupingContent &&
                          `${
                            hasBeenDispensed ? 'Refill' : 'Fill'
                          } this prescription`}
                        {showGroupingContent &&
                          `Request a ${hasBeenDispensed ? 'refill' : 'fill'}`}
                      </Link>
                    ) : (
                      <FillRefillButton {...prescription} />
                    )}
                  </>
                )}

                {prescription && <ExtraDetails {...prescription} />}
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Prescription number
                </h3>
                <p data-testid="prescription-number" data-dd-privacy="mask">
                  {prescription.prescriptionNumber}
                </p>
              </>
            )}
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Status
            </h3>
            {determineStatus()}
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Refills left
            </h3>
            <p data-testid="refills-left">
              {validateField(prescription.refillRemaining)}
            </p>
            {!pendingMed && (
              <>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Request refills by this prescription expiration date
                </h3>
                <p data-testid="expiration-date">
                  {dateFormat(prescription.expirationDate)}
                </p>
              </>
            )}
            {/* TODO: clean after grouping flag is gone */}
            {!showGroupingContent && (
              <>
                <h3
                  className="vads-u-font-size--base vads-u-font-family--sans"
                  data-dd-privacy="mask"
                >
                  Prescription number
                </h3>
                <p data-testid="prescription-number" data-dd-privacy="mask">
                  {prescription.prescriptionNumber}
                </p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Prescribed on
                </h3>
                <p datat-testid="ordered-date">
                  {dateFormat(prescription.orderedDate)}
                </p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Prescribed by
                </h3>
                <p>
                  {prescription?.providerFirstName &&
                  prescription?.providerLastName
                    ? validateField(
                        `${prescription.providerLastName}, ${
                          prescription.providerFirstName
                        }`,
                      )
                    : EMPTY_FIELD}
                </p>
              </>
            )}
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Facility
            </h3>
            <p data-testid="facility-name">{prescription.facilityName}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
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
                EMPTY_FIELD
              )}
            </div>
            {/* TODO: clean after grouping flag is gone */}
            {showGroupingContent && (
              <>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Instructions
                </h3>
                <p>{validateField(prescription?.sig)}</p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Reason for use
                </h3>
                <p>{validateField(prescription?.indicationForUse)}</p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Quantity
                </h3>
                <p>{validateField(prescription.quantity)}</p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Prescribed on
                </h3>
                <p datat-testid="ordered-date">
                  {dateFormat(prescription.orderedDate)}
                </p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Prescribed by
                </h3>
                <p>
                  {prescription?.providerFirstName &&
                  prescription?.providerLastName
                    ? validateField(
                        `${prescription.providerLastName}, ${
                          prescription.providerFirstName
                        }`,
                      )
                    : EMPTY_FIELD}
                </p>
              </>
            )}
          </div>
          {/* TODO: clean after grouping flag is gone */}
          {!showGroupingContent && (
            <>
              <div className="medication-details-div vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-y--3">
                <h2 className="vads-u-margin-top--3">
                  About this medication or supply
                </h2>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Instructions
                </h3>
                <p>{validateField(prescription?.sig)}</p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Reason for use
                </h3>
                <p>{validateField(prescription?.indicationForUse)}</p>
                <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                  Quantity
                </h3>
                <p>{validateField(prescription.quantity)}</p>
                {isDisplayingDocumentation &&
                  // Any of the Rx's NDC's will work here. They should all show the same information
                  refillHistory.some(p => p.cmopNdcNumber) && (
                    <Link
                      to={`/prescription/${
                        prescription.prescriptionId
                      }/documentation`}
                      data-testid="va-prescription-documentation-link"
                      className="vads-u-margin-top--1 vads-u-display--inline-block vads-u-font-weight--bold"
                      data-dd-action-name={
                        dataDogActionNames.detailsPage.RX_DOCUMENTATION_LINK
                      }
                    >
                      Learn more about this medication
                    </Link>
                  )}
              </div>
            </>
          )}

          {/* TODO: clean after grouping flag is gone */}
          {showGroupingContent && (
            <>
              <div className="medication-details-div vads-u-margin-bottom--3">
                {isDisplayingDocumentation &&
                  // Any of the Rx's NDC's will work here. They should all show the same information
                  refillHistory.some(p => p.cmopNdcNumber) && (
                    <Link
                      to={`/prescription/${
                        prescription.prescriptionId
                      }/documentation`}
                      data-testid="va-prescription-documentation-link"
                      // TODO: clean after grouping flag is gone
                      className={`${
                        !showGroupingContent ? 'vads-u-margin-top--1 ' : ''
                      }vads-u-display--inline-block vads-u-font-weight--bold`}
                      data-dd-action-name={
                        dataDogActionNames.detailsPage.RX_DOCUMENTATION_LINK
                      }
                    >
                      Learn more about this medication
                    </Link>
                  )}
              </div>
            </>
          )}
          {!pendingMed && (
            <div>
              {!pendingRenewal && (
                <>
                  {/* TODO: clean after grouping flag is gone */}
                  {!showGroupingContent && (
                    <h2
                      className="vads-u-margin-top--3"
                      data-testid="refill-History"
                    >
                      Refill history
                    </h2>
                  )}
                  {showGroupingContent && (
                    <h3
                      className="vads-u-margin-top--3"
                      data-testid="refill-History"
                    >
                      Refill history
                    </h3>
                  )}
                  {refillHistory?.length > 1 &&
                    refillHistory.some(rx => rx.cmopNdcNumber) && (
                      <p className="vads-u-margin--0">
                        <strong>Note:</strong> Images on this page are for
                        identification purposes only. They don’t mean that this
                        is the amount of medication you’re supposed to take. If
                        the most recent image doesn’t match what you’re taking,
                        call <VaPharmacyText phone={pharmacyPhone} />.
                      </p>
                    )}
                  {/* TODO: clean after grouping flag is gone */}
                  {!showGroupingContent &&
                    ((refillHistory.length > 1 ||
                      refillHistory[0].dispensedDate !== undefined) &&
                      refillHistory.map((entry, i) => {
                        const {
                          shape,
                          color,
                          backImprint,
                          frontImprint,
                        } = entry;
                        const refillPosition = refillHistory.length - i - 1;
                        const refillLabelId = `rx-refill-${refillPosition}`;
                        return (
                          <div
                            key={i}
                            className={
                              i + 1 < refillHistory.length
                                ? 'vads-u-margin-bottom--3 refill-entry'
                                : 'refill-entry'
                            }
                          >
                            <h3
                              className="vads-u-margin-y--2 vads-u-font-size--lg vads-u-font-family--sans vads-u-margin-bottom--2"
                              data-testid="rx-refill"
                              id={refillLabelId}
                            >
                              {i + 1 === refillHistory.length
                                ? 'Original fill'
                                : `Refill ${refillPosition}`}
                            </h3>
                            <h4
                              className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                              data-testid="fill-date"
                            >
                              Filled by pharmacy on
                            </h4>
                            <p
                              className="vads-u-margin--0 vads-u-margin-bottom--1"
                              data-testid="dispensedDate"
                            >
                              {dateFormat(entry.dispensedDate)}
                            </p>
                            <h4
                              className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                              data-testid="shipped-date"
                            >
                              Shipped on
                            </h4>
                            <p
                              className="vads-u-margin--0 vads-u-margin-bottom--1"
                              data-testid="shipped-on"
                            >
                              {dateFormat(
                                latestTrackingStatus?.completeDateTime,
                              )}
                            </p>
                            <h4
                              className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                              data-testid="med-image"
                              aria-hidden="true"
                            >
                              Image
                            </h4>
                            <div className="no-print" aria-hidden="true">
                              {entry.cmopNdcNumber ? (
                                <>
                                  <img
                                    alt=""
                                    className="vads-u-margin-top--1"
                                    data-testid="rx-image"
                                    src={getImageUri(entry.cmopNdcNumber)}
                                    width="350"
                                    height="350"
                                  />
                                </>
                              ) : (
                                <p
                                  className="vads-u-margin--0"
                                  data-testid="no-image"
                                >
                                  Image not available
                                </p>
                              )}
                            </div>
                            <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0">
                              Medication description
                            </h4>
                            <div data-testid="rx-description">
                              {shape?.trim() &&
                              color?.trim() &&
                              frontImprint?.trim() ? (
                                <>
                                  <p className="vads-u-margin--0">
                                    <strong>Note:</strong> If the medication
                                    you’re taking doesn’t match this
                                    description, call{' '}
                                    <VaPharmacyText phone={pharmacyPhone} />.
                                  </p>
                                  <ul className="vads-u-margin--0">
                                    <li
                                      className="vads-u-margin-y--0"
                                      data-testid="rx-shape"
                                    >
                                      <strong>Shape:</strong>{' '}
                                      {shape[0].toUpperCase()}
                                      {shape.slice(1).toLowerCase()}
                                    </li>
                                    <li
                                      className="vads-u-margin-y--0"
                                      data-testid="rx-color"
                                    >
                                      <strong>Color:</strong>{' '}
                                      {color[0].toUpperCase()}
                                      {color.slice(1).toLowerCase()}
                                    </li>
                                    <li
                                      className="vads-u-margin-y--0"
                                      data-testid="rx-front-marking"
                                    >
                                      <strong>Front marking:</strong>{' '}
                                      {frontImprint}
                                    </li>
                                    {backImprint ? (
                                      <li
                                        className="vads-u-margin-y--0"
                                        data-testid="rx-back-marking"
                                      >
                                        <strong>Back marking:</strong>{' '}
                                        {backImprint}
                                      </li>
                                    ) : (
                                      <></>
                                    )}
                                  </ul>
                                </>
                              ) : (
                                <>
                                  No description available. Call{' '}
                                  <VaPharmacyText phone={pharmacyPhone} /> if
                                  you need help identifying this medication.
                                </>
                              )}
                            </div>
                          </div>
                        );
                      }))}
                  {showGroupingContent &&
                    (refillHistory?.length > 1 ||
                      refillHistory[0].dispensedDate !== undefined) && (
                      <>
                        <p
                          className="vads-u-margin-top--2 vads-u-margin-bottom--0"
                          data-testid="refill-history-info"
                        >
                          {`Showing ${refillHistory.length} refill${
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
                            return (
                              <va-accordion-item
                                bordered="true"
                                key={i}
                                subHeader={`Filled on ${dateFormat(
                                  entry.dispensedDate,
                                )}`}
                              >
                                <h4
                                  className="vads-u-font-size--h6"
                                  data-testid="rx-refill"
                                  id={refillLabelId}
                                  slot="headline"
                                >
                                  {i + 1 === refillHistory.length
                                    ? 'Original fill'
                                    : `Refill`}
                                </h4>
                                {i === 0 && (
                                  <>
                                    <h4
                                      className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0"
                                      data-testid="shipped-date"
                                    >
                                      Shipped on
                                    </h4>
                                    <p
                                      className="vads-u-margin--0 vads-u-margin-bottom--1"
                                      data-testid="shipped-on"
                                    >
                                      {dateFormat(
                                        latestTrackingStatus?.completeDateTime,
                                      )}
                                    </p>
                                  </>
                                )}
                                <h4
                                  className={`${
                                    i === 0 ? 'vads-u-margin-top--2 ' : ''
                                  }vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0`}
                                  data-testid="med-image"
                                  aria-hidden="true"
                                >
                                  Image
                                </h4>
                                <div className="no-print" aria-hidden="true">
                                  {entry.cmopNdcNumber ? (
                                    <>
                                      <img
                                        alt=""
                                        className="vads-u-margin-top--1"
                                        data-testid="rx-image"
                                        src={getImageUri(entry.cmopNdcNumber)}
                                        width="350"
                                        height="350"
                                      />
                                    </>
                                  ) : (
                                    <p
                                      className="vads-u-margin--0"
                                      data-testid="no-image"
                                    >
                                      Image not available
                                    </p>
                                  )}
                                </div>
                                <h4
                                  className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                                  data-testid="med-description"
                                >
                                  Medication description
                                </h4>
                                <div data-testid="rx-description">
                                  {shape?.trim() &&
                                  color?.trim() &&
                                  frontImprint?.trim() ? (
                                    <>
                                      <p className="vads-u-margin--0">
                                        <strong>Note:</strong> If the medication
                                        you’re taking doesn’t match this
                                        description, call{' '}
                                        <VaPharmacyText phone={pharmacyPhone} />
                                        .
                                      </p>
                                      <ul className="vads-u-margin--0">
                                        <li
                                          className="vads-u-margin-y--0"
                                          data-testid="rx-shape"
                                        >
                                          <strong>Shape:</strong>{' '}
                                          {shape[0].toUpperCase()}
                                          {shape.slice(1).toLowerCase()}
                                        </li>
                                        <li
                                          className="vads-u-margin-y--0"
                                          data-testid="rx-color"
                                        >
                                          <strong>Color:</strong>{' '}
                                          {color[0].toUpperCase()}
                                          {color.slice(1).toLowerCase()}
                                        </li>
                                        <li
                                          className="vads-u-margin-y--0"
                                          data-testid="rx-front-marking"
                                        >
                                          <strong>Front marking:</strong>{' '}
                                          {frontImprint}
                                        </li>
                                        {backImprint ? (
                                          <li
                                            className="vads-u-margin-y--0"
                                            data-testid="rx-back-marking"
                                          >
                                            <strong>Back marking:</strong>{' '}
                                            {backImprint}
                                          </li>
                                        ) : (
                                          <></>
                                        )}
                                      </ul>
                                    </>
                                  ) : (
                                    <>
                                      No description available. Call{' '}
                                      <VaPharmacyText phone={pharmacyPhone} />{' '}
                                      if you need help identifying this
                                      medication.
                                    </>
                                  )}
                                </div>
                              </va-accordion-item>
                            );
                          })}
                        </VaAccordion>
                      </>
                    )}
                  {refillHistory?.length <= 1 &&
                    refillHistory[0].dispensedDate === undefined && (
                      <p>You haven’t filled this prescription yet.</p>
                    )}
                </>
              )}
              {showGroupingContent &&
                prescription?.groupedMedications?.length > 0 && (
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
