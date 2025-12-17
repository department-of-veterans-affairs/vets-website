import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../../utils';

const ConfirmationRatedDisabilities = ({ formData }) => {
  const { ratedDisabilities = [] } = formData || {};
  const selectedRated = ratedDisabilities.filter(d => d['view:selected']);

  return (
    <>
      {selectedRated.map(dis => (
        <li key={dis.name}>
          <h4>{capitalizeEachWord(dis.name)}</h4>
          <div className="vads-u-color--gray">Description</div>
          {dis.ratingPercentage && (
            <span>
              {'Claiming an increase from current '}
              {dis.ratingPercentage}% rating
            </span>
          )}
        </li>
      ))}
    </>
  );
};

ConfirmationRatedDisabilities.propTypes = {
  formData: PropTypes.shape({
    ratedDisabilities: PropTypes.array,
  }),
};

export default ConfirmationRatedDisabilities;
