import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { dateFormat } from '../../medical-records/util/helpers';
import { getPrescriptionDetails } from '../actions/prescriptions';
import PrintHeader from './PrintHeader';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const PrescriptionDetails = () => {
  const prescription = useSelector(
    state => state.rx.prescriptions.prescriptionDetails,
  );
  const { prescriptionId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (prescription) {
      dispatch(
        setBreadcrumbs(
          [
            { url: '/my-health/medications/', label: 'Dashboard' },
            {
              url: '/my-health/medications/prescriptions/',
              label: 'Prescriptions',
            },
          ],
          {
            url: `/my-health/medications/prescriptions/${
              prescription.prescriptionId
            }`,
            label: prescription.prescriptionName,
          },
        ),
      );
    }
  });

  useEffect(
    () => {
      if (prescriptionId) dispatch(getPrescriptionDetails(prescriptionId));
    },
    [prescriptionId, dispatch],
  );

  const content = () => {
    if (prescription) {
      return (
        <>
          <PrintHeader />
          <h1 className="page-title">{prescription.prescriptionName}</h1>

          <div className="no-print">
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
              data-testid="print-records-button"
              onClick={window.print}
            >
              <i
                aria-hidden="true"
                className="fas fa-print vads-u-margin-right--0p5"
              />
              Print medication details
            </button>
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--0p5"
              />
              Download as a PDF
            </button>
            <button
              type="button"
              className="link-button vads-u-display--block vads-u-margin-bottom--2"
            >
              <i
                aria-hidden="true"
                className="fas fa-download vads-u-margin-right--0p5"
              />
              Download as a Text file
            </button>
            <va-additional-info trigger="What to know about downloading records">
              <ul>
                <li>
                  <strong>If you’re on a public or shared computer,</strong>{' '}
                  print your records instead of downloading. Downloading will
                  save a copy of your records to the public computer.
                </li>
                <li>
                  <strong>If you use assistive technology,</strong> a Text file
                  (.txt) may work better for technology such as screen reader,
                  screen enlargers, or Braille displays.
                </li>
              </ul>
            </va-additional-info>
          </div>

          <div className="medication-details-div vads-u-margin-y--2 vads-u-padding-bottom--3">
            <h2 className="vads-u-margin-y--2 no-print">Medication details</h2>
            <div className="no-print">
              <va-button text="Refill medication" />
            </div>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Prescription number
            </h3>
            <p>{prescription.prescriptionId}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Instructions
            </h3>
            <p>
              {prescription?.sig ||
                "No instructions specified, please refer to the medication's label."}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Status
            </h3>
            <div className="no-print">
              <va-additional-info
                trigger={
                  prescription.refillStatus === 'refillinprocess'
                    ? 'Refill in process'
                    : prescription.refillStatus.charAt(0).toUpperCase() +
                      prescription.refillStatus.slice(1)
                }
              >
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
            <div className="print-only">
              {prescription.refillStatus === 'refillinprocess'
                ? 'refill in process'
                : prescription.refillStatus}
            </div>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Refills left
            </h3>
            <p>{prescription.refillRemaining}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Quantity
            </h3>
            <p>{prescription.quantity}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Ordered on date
            </h3>
            <p>{dateFormat(prescription.orderedDate, 'MMMM D, YYYY')}</p>
            <div className="no-print">
              <va-additional-info trigger="What does this mean?">
                <p>
                  A medication’s ordered on date refers to the date that you
                  last requested a refill of the medication. If you have never
                  requested a refill, this date represents the date that your
                  provider prescribed this medication.
                </p>
              </va-additional-info>
            </div>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Expiration date
            </h3>
            <p>{dateFormat(prescription.expirationDate, 'MMMM D, YYYY')}</p>
            <div className="no-print">
              <va-additional-info trigger="What does this mean?">
                <p>
                  A medication’s expiration date refers to when your medication
                  should be replaced by a refill, whether you have finished the
                  current quantity or not. Please do not use or take expired
                  medication.
                </p>
              </va-additional-info>
            </div>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Prescriber name
            </h3>
            <p>{prescription?.presciberName || 'No provider specified'}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Facility
            </h3>
            <p>{prescription.facilityName}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Phone number
            </h3>
            <div className="no-print">
              {prescription?.phoneNumber ? (
                <va-telephone contact={prescription.phoneNumber} />
              ) : (
                'No phone number provided'
              )}
            </div>
            <div className="print-only">
              {prescription?.phoneNumber || 'No phone number provided'}
            </div>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Category
            </h3>
            <p>{prescription?.category || 'No category specified'}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Source
            </h3>
            <p>{prescription?.source || 'No source specified'}</p>
          </div>
          <div className="vads-u-margin-bottom--8">
            <h2 className="vads-u-margin-top--3">
              Refill history and medication images
            </h2>
            {prescription.history && prescription.history.length > 0 ? (
              prescription.history.map(entry => (
                <div key={entry.requestDate}>
                  <h3 className="vads-u-font-size--lg vads-u-font-family--sans">
                    {dateFormat(entry.requestDate, 'MMMM YYYY')}
                  </h3>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                    Requested on
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {dateFormat(entry.requestDate, 'MMMM D, YYYY [at] h:mm z')}
                  </p>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                    Dispensed on
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {dateFormat(entry.dispenseDate, 'MMMM D, YYYY [at] h:mm z')}
                  </p>
                  <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
                    Shipped on
                  </h4>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {dateFormat(entry.shippedDate, 'MMMM D, YYYY [at] h:mm z')}
                  </p>
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

export default PrescriptionDetails;
