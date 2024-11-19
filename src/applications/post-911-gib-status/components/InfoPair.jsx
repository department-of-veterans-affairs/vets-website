import React from 'react';
import PropTypes from 'prop-types';

const InfoPair = ({ label, value, id, additionalClass, displayIfZero }) => {
  const gridRowClasses = additionalClass
    ? `usa-grid-full ${additionalClass}`
    : 'usa-grid-full';

  const row = (
    <div className={gridRowClasses}>
      <div className="usa-width-one-third">
        <span>
          <strong>{label}: </strong>
        </span>
      </div>
      <div className="usa-width-two-thirds" id={id}>
        {value}
      </div>
    </div>
  );

  // The displayIfZero prop may be passed in because some rows should
  // display 0 values, while other rows should not display any 0 values.
  // If displayIfZero is false or is not passed in, only display the
  // row if the value is defined and nonzero.
  const rowToDisplay = displayIfZero ? row : value && row;

  return rowToDisplay || null;
};

InfoPair.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  id: PropTypes.string,
  additionalClass: PropTypes.string,
  displayIfZero: PropTypes.bool,
};

export default InfoPair;
