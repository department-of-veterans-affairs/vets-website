import React from 'react';
import PropTypes from 'prop-types';
import { validateField } from '../../util/helpers';
import TrackingInfo from '../shared/TrackingInfo';
import FillRefillButton from '../shared/FillRefillButton';

const VaPrescription = prescription => {
  const refillHistory = prescription?.rxRfRecords?.[0]?.[1];
  const shippedOn = prescription?.trackingList?.[0]?.[1];
  const content = () => {
    if (prescription) {
      const refillStatus = prescription.refillStatus?.toString();
      return (
        <>
          <div className="medication-details-div vads-u-margin-top--2 vads-u-margin-bottom--3">
            {shippedOn?.[0] && (
              <TrackingInfo
                {...shippedOn[0]}
                prescriptionName={prescription.prescriptionName}
              />
            )}
            <h2 className="vads-u-margin-y--2 no-print">
              About your prescription
            </h2>
            <FillRefillButton {...prescription} />
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Status
            </h3>
            <div data-testid="status">
              {prescription.refillStatus === 'refillinprocess'
                ? 'Refill in process'
                : validateField(
                    refillStatus?.charAt(0).toUpperCase() +
                      refillStatus?.slice(1),
                  )}
            </div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <ul>
                  <li>
                    An active medication is a prescription still in use and
                    available for refill.
                  </li>
                  <li>
                    An inactive medication is a past prescription that should no
                    longer be refilled without first talking with your care
                    provider.
                  </li>
                </ul>
              </va-additional-info>
            </div>
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
              {validateField(prescription.expirationDate, 'date')}
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
              {validateField(prescription.orderedDate, 'date')}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Prescribed by
            </h3>
            <p>
              {validateField(
                `${prescription.providerLastName}, ${
                  prescription.providerFirstName
                }`,
              )}
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
            <div className="print-only">
              {prescription?.phoneNumber || 'No phone number provided'}
            </div>
          </div>

          <div className="medication-details-div vads-u-margin-y--3">
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
            <p>{validateField(prescription?.reason)}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Quantity
            </h3>
            <p>{validateField(prescription.quantity)}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              What it looks like
            </h3>
            <p>
              Your medication may look different when you get a refill. Find the
              most recent description and image in your refill history.
            </p>
          </div>

          <div className="medication-details-div">
            <h2 className="vads-u-margin-top--3">Refill history</h2>
            {refillHistory && refillHistory.length > 0 ? (
              refillHistory.map((entry, i) => (
                <div
                  key={entry.id}
                  className={
                    i + 1 < refillHistory.length && 'vads-u-margin-bottom--3'
                  }
                >
                  <h3 className="vads-u-font-size--lg vads-u-font-family--sans vads-u-margin-bottom--2">
                    {i + 1 === refillHistory.length
                      ? 'Original Fill'
                      : `Refill #${refillHistory.length - i - 1}`}
                  </h3>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0">
                    Filled by pharmacy on
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {validateField(entry.dispensedDate, 'date')}
                  </p>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0">
                    Shipped on
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {validateField(shippedOn?.[i]?.completeDateTime, 'date')}
                  </p>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0">
                    Description of the medication or supply
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {/* TODO: Not yet available */}
                    None noted
                  </p>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin--0">
                    Image of the medication or supply
                  </h4>
                  <div className="no-print">
                    <va-additional-info trigger="Review image">
                      <p>This is where the image goes</p>
                    </va-additional-info>
                  </div>
                </div>
              ))
            ) : (
              <p>No recorded history for this medication.</p>
            )}
          </div>
        </>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
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
