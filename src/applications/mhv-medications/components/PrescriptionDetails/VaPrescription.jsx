import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  validateField,
  getImageUri,
  dateFormat,
  createOriginalFillRecord,
  pharmacyPhoneNumber,
} from '../../util/helpers';
import TrackingInfo from '../shared/TrackingInfo';
import FillRefillButton from '../shared/FillRefillButton';
import StatusDropdown from '../shared/StatusDropdown';
import ExtraDetails from '../shared/ExtraDetails';
import { selectRefillContentFlag } from '../../util/selectors';
import VaPharmacyText from '../shared/VaPharmacyText';
import { EMPTY_FIELD } from '../../util/constants';
import { dataDogActionNames } from '../../util/dataDogConstants';

const VaPrescription = prescription => {
  const showRefillContent = useSelector(selectRefillContentFlag);
  const isDisplayingDocumentation = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
  );
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  const originalFill = createOriginalFillRecord(prescription);
  const pharmacyPhone = pharmacyPhoneNumber(prescription);
  refillHistory.push(originalFill);

  const hasBeenDispensed =
    prescription?.dispensedDate ||
    prescription?.rxRfRecords.find(record => record.dispensedDate);
  const latestTrackingStatus = prescription?.trackingList?.[0];
  const content = () => {
    if (prescription) {
      const dispStatus = prescription.dispStatus?.toString();
      return (
        <>
          <div className="medication-details-div vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-top--2 vads-u-margin-bottom--3">
            {latestTrackingStatus && (
              <TrackingInfo
                {...latestTrackingStatus}
                prescriptionName={prescription.prescriptionName}
              />
            )}
            <h2 className="vads-u-margin-y--2">About your prescription</h2>
            {prescription && <ExtraDetails {...prescription} />}
            {showRefillContent && prescription?.isRefillable ? (
              <Link
                className="vads-u-display--block vads-c-action-link--green vads-u-margin-top--3 vads-u-margin-bottom--3"
                to="/refill"
                data-testid="refill-nav-link"
              >
                {hasBeenDispensed ? 'Refill' : 'Fill'} this prescription
              </Link>
            ) : (
              <FillRefillButton {...prescription} />
            )}
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Status
            </h3>
            <StatusDropdown status={dispStatus} />
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Refills left
            </h3>
            <p data-testid="refills-left">
              {validateField(prescription.refillRemaining)}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Request refills by this prescription expiration date
            </h3>
            <p data-testid="expiration-date">
              {dateFormat(prescription.expirationDate)}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Prescription number
            </h3>
            <p data-testid="prescription-number">
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
              {prescription?.providerFirstName && prescription?.providerLastName
                ? validateField(
                    `${prescription.providerLastName}, ${
                      prescription.providerFirstName
                    }`,
                  )
                : EMPTY_FIELD}
            </p>
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
          </div>

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
                  }/documentation?ndc=${
                    refillHistory?.find(p => !!p?.cmopNdcNumber)?.cmopNdcNumber
                  }`}
                  data-testid="va-prescription-documentation-link"
                  className="vads-u-margin-top--1 vads-u-display--inline-block vads-u-font-weight--bold"
                  data-dd-action-name={
                    dataDogActionNames.detailsPage.RX_DOCUMENTATION_LINK
                  }
                >
                  Learn more about {prescription.prescriptionName}
                </Link>
              )}
          </div>
          <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter">
            <h2 className="vads-u-margin-top--3" data-testid="refill-History">
              Refill history
            </h2>
            {refillHistory.length > 1 &&
              refillHistory.some(rx => rx.cmopNdcNumber) && (
                <p className="vads-u-margin--0">
                  <strong>Note:</strong> Images on this page are for
                  identification purposes only. They don’t mean that this is the
                  amount of medication you’re supposed to take. If the most
                  recent image doesn’t match what you’re taking, call{' '}
                  <VaPharmacyText phone={pharmacyPhone} />.
                </p>
              )}
            {(refillHistory.length > 1 ||
              refillHistory[0].dispensedDate !== undefined) &&
              refillHistory.map((entry, i) => {
                const { shape, color, backImprint, frontImprint } = entry;
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
                      {dateFormat(latestTrackingStatus?.completeDateTime)}
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
                        <p className="vads-u-margin--0" data-testid="no-image">
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
                            <strong>Note:</strong> If the medication you’re
                            taking doesn’t match this description, call{' '}
                            <VaPharmacyText phone={pharmacyPhone} />.
                          </p>
                          <ul className="vads-u-margin--0">
                            <li
                              className="vads-u-margin-y--0"
                              data-testid="rx-shape"
                            >
                              <strong>Shape:</strong> {shape[0].toUpperCase()}
                              {shape.slice(1).toLowerCase()}
                            </li>
                            <li
                              className="vads-u-margin-y--0"
                              data-testid="rx-color"
                            >
                              <strong>Color:</strong> {color[0].toUpperCase()}
                              {color.slice(1).toLowerCase()}
                            </li>
                            <li
                              className="vads-u-margin-y--0"
                              data-testid="rx-front-marking"
                            >
                              <strong>Front marking:</strong> {frontImprint}
                            </li>
                            {backImprint ? (
                              <li
                                className="vads-u-margin-y--0"
                                data-testid="rx-back-marking"
                              >
                                <strong>Back marking:</strong> {backImprint}
                              </li>
                            ) : (
                              <></>
                            )}
                          </ul>
                        </>
                      ) : (
                        <>
                          No description available. Call{' '}
                          <VaPharmacyText phone={pharmacyPhone} /> if you need
                          help identifying this medication.
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            {refillHistory.length <= 1 &&
              refillHistory[0].dispensedDate === undefined && (
                <p>You haven’t filled this prescription yet.</p>
              )}
          </div>
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
