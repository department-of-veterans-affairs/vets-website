import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { validateField, getImageUri, dateFormat } from '../../util/helpers';
import TrackingInfo from '../shared/TrackingInfo';
import FillRefillButton from '../shared/FillRefillButton';
import StatusDropdown from '../shared/StatusDropdown';
import ExtraDetails from '../shared/ExtraDetails';
import { selectRefillContentFlag } from '../../util/selectors';

const VaPrescription = prescription => {
  const showRefillContent = useSelector(selectRefillContentFlag);
  const refillHistory = [...(prescription?.rxRfRecords?.[0]?.[1] || [])];
  refillHistory.push({
    prescriptionName: prescription?.prescriptionName,
    dispensedDate: prescription?.dispensedDate,
    cmopNdcNumber: prescription?.cmopNdcNumber,
    id: prescription?.prescriptionId,
  });

  const hasBeenDispensed =
    prescription?.dispensedDate ||
    prescription?.rxRfRecords?.[0]?.[1].find(record => record.dispensedDate);
  const shippedOn = prescription?.trackingList?.[0]?.[1];
  const content = () => {
    if (prescription) {
      const dispStatus = prescription.dispStatus?.toString();
      return (
        <>
          <div className="medication-details-div vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-top--2 vads-u-margin-bottom--3">
            {shippedOn?.[0] && (
              <TrackingInfo
                {...shippedOn[0]}
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
                : 'None noted'}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Facility
            </h3>
            <p data-testid="facility-name">{prescription.facilityName}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Pharmacy phone number
            </h3>
            <div className="no-print">
              {prescription?.phoneNumber ? (
                <va-telephone contact={prescription.phoneNumber} />
              ) : (
                'None noted'
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
          </div>
          <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter">
            <h2 className="vads-u-margin-top--3" data-testid="refill-History">
              Refill history
            </h2>
            {(refillHistory.length > 1 ||
              refillHistory[0].dispensedDate !== undefined) &&
              refillHistory.map((entry, i) => (
                <div
                  key={entry.id}
                  className={
                    i + 1 < refillHistory.length
                      ? 'vads-u-margin-bottom--3 refill-entry'
                      : 'refill-entry'
                  }
                >
                  <h3
                    className="vads-u-margin-y--2 vads-u-font-size--lg vads-u-font-family--sans vads-u-margin-bottom--2"
                    data-testid="refill"
                  >
                    {i + 1 === refillHistory.length
                      ? 'First fill'
                      : `Refill ${refillHistory.length - i - 1}`}
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
                    {dateFormat(shippedOn?.[i]?.completeDateTime)}
                  </p>
                  <h4
                    className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0"
                    data-testid="med-image"
                  >
                    Image of the medication or supply
                  </h4>
                  <div className="no-print">
                    {entry.cmopNdcNumber ? (
                      <va-additional-info
                        trigger="Review image"
                        data-testid="review-rx-image"
                        uswds
                      >
                        <img
                          src={getImageUri(entry.cmopNdcNumber)}
                          alt={entry.prescriptionName}
                          width="350"
                          height="350"
                        />
                      </va-additional-info>
                    ) : (
                      <p className="vads-u-margin--0" data-testid="no-image">
                        No image available
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
