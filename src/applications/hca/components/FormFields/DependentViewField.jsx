import React from 'react';
import PropTypes from 'prop-types';

const DependentViewField = ({ formData }) => {
  const { fullName, dependentRelation } = formData;
  return (
    <div>
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
