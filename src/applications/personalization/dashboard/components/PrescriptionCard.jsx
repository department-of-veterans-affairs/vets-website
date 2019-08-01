import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

export default function PrescriptionCard({ prescription }) {
  const {
    prescriptionName,
    refillSubmitDate,
    refillDate,
    isTrackable,
  } = prescription.attributes;

  const submittedDate = moment(refillSubmitDate || refillDate).startOf('day');
  const dateInPast =
    submittedDate.isValid() &&
    moment()
      .startOf('day')
      .isSameOrAfter(submittedDate);

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">{prescriptionName}</h3>
      <p>
        <strong>Order status:</strong>{' '}
        {isTrackable
          ? 'We’ve shipped your order'
          : 'We’re working to fill your prescription'}
      </p>
      {dateInPast && (
        <p>
          <strong>You submitted your refill order on:</strong>{' '}
          {submittedDate.format('L')}
        </p>
      )}
    </div>
  );
}

PrescriptionCard.propTypes = {
  prescription: PropTypes.shape({
    attributes: PropTypes.shape({
      prescriptionName: PropTypes.string.isRequired,
      refillSubmitDate: PropTypes.string,
      refillDate: PropTypes.string.isRequired,
      isTrackable: PropTypes.bool.isRequired,
    }).isRequired,
  }),
};
