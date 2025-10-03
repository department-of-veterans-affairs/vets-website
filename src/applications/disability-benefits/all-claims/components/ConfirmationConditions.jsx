import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationConditions = ({ formData }) => {
  const { newDisabilities = [], ratedDisabilities = [] } = formData || {};
  // Only show rated disabilities that are selected
  const selectedRated = ratedDisabilities.filter(d => d['view:selected']);
  console.log(selectedRated, 'selectedRated');

  return (
    <div>
      <h4>Review your conditions</h4>
      <ul>
        {selectedRated.map(dis => (
          <li key={dis.name}>
            <strong>{dis.name}</strong>
            {dis.rating && (
              <span className="vads-u-color--gray"> — {dis.rating}%</span>
            )}
            <div className="vads-u-color--gray">Rated disability</div>
          </li>
        ))}
        {newDisabilities.map(dis => (
          <li key={dis.condition}>
            <strong>{dis.condition}</strong>
            <div className="vads-u-color--gray">New disability</div>
            {dis.description && (
              <div className="vads-u-font-size--sm">{dis.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

ConfirmationConditions.propTypes = {
  formData: PropTypes.shape({
    newDisabilities: PropTypes.array,
    ratedDisabilities: PropTypes.array,
  }),
};

export default ConfirmationConditions;
