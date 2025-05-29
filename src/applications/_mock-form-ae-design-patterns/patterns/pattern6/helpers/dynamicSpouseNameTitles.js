import React from 'react';
import PropTypes from 'prop-types';

export const DynamicSpouseNameTitle = ({ formContext }) => {
  const currentSpouseFirstName =
    formContext?.formData?.spouseFullName?.first ?? 'your current spouse';

  return (
    <legend className="schemaform-block-title">
      Enter the name of {currentSpouseFirstName}'s previous spouse
    </legend>
  );
};

export const MarriageEndReasonTitle = ({ formContext }) => {
  const currentSpouseFirstName =
    formContext?.formData?.spouseFullName?.first ?? 'your current spouse';

  return (
    <legend className="schemaform-block-title">
      How did {currentSpouseFirstName}'s previous marriage end?{' '}
      <span className="end-title-span">(*Required)</span>
    </legend>
  );
};

DynamicSpouseNameTitle.propTypes = {
  formContext: PropTypes.object,
};
MarriageEndReasonTitle.propTypes = {
  formContext: PropTypes.object,
};

// export default DynamicSpouseNameTitle;
