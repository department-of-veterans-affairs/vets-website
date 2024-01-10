import React from 'react';
import PropTypes from 'prop-types';

const DependentViewField = ({ formData }) => {
  const { fullName, dependentRelation } = formData;
  return (
    <div className="dd-privacy-hidden" data-dd-action-name="dependent">
      <strong>
        {fullName.first} {fullName.last}
      </strong>
      <br />
      {dependentRelation}
    </div>
  );
};

DependentViewField.propTypes = {
  formData: PropTypes.object,
};

export default DependentViewField;
