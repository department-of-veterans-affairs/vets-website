import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { formatDate } from '../../../rx/utils/helpers';

export default function PrescriptionCard({ prescription }) {
  const { prescriptionName, refillSubmitDate, refillDate, refillStatus } = prescription.attributes;

  const headerText = {
    refillinprocess: 'Your prescription refill is in progress',
  };

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">
        {prescriptionName}
      </h3>
      <p>
        <strong>Order status:</strong> {headerText[refillStatus]}
      </p>
      <p><strong>You submitted your refil order on:</strong> {
        formatDate(refillSubmitDate || refillDate, {
          format: 'L'
        })
      }</p>
      <p>
        <Link className="usa-button usa-button-primary" href={`/health-care/prescriptions/${prescription.id}`}>View Your Prescription<i className="fa fa-chevron-right"/></Link>
      </p>
    </div>
  );
}

PrescriptionCard.propTypes = {
  prescription: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      prescriptionId: PropTypes.number.isRequired,
      prescriptionNumber: PropTypes.string.isRequired,
      prescriptionName: PropTypes.string.isRequired,
      refillSubmitDate: PropTypes.string,
      refillDate: PropTypes.string.isRequired,
      refillRemaining: PropTypes.number.isRequired,
      facilityName: PropTypes.string.isRequired,
      orderedDate: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      expirationDate: PropTypes.string.isRequired,
      dispensedDate: PropTypes.string,
      stationNumber: PropTypes.string,
      isRefillable: PropTypes.bool.isRequired,
      isTrackable: PropTypes.bool.isRequired,
    }).isRequired
  })
};
