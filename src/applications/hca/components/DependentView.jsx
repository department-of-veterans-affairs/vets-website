import React from 'react';
import PropTypes from 'prop-types';

const DependentView = ({ formData }) => {
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

DependentView.propTypes = {
  formData: PropTypes.object,
};

export default DependentView;
