import React from 'react';
import PropTypes from 'prop-types';

const DependentView = ({ formData }) => {
  const { dependentRelation, fullName } = formData;
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
