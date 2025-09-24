import React from 'react';
import PropTypes from 'prop-types';

export const DynamicSpouseNameTitle = ({ formContext }) => {
  const currentSpouseFirstName =
    formContext?.formData?.spouseFullName?.first ?? 'your current spouse';

  return (
    <legend className="schemaform-block-title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        Enter the name of {currentSpouseFirstName}
        's previous spouse
      </h3>
    </legend>
  );
};

export const MarriageEndReasonTitle = ({ formContext }) => {
  const currentSpouseFirstName =
    formContext?.formData?.spouseFullName?.first ?? 'your current spouse';

  return (
    <legend className="schemaform-block-title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        How did {currentSpouseFirstName}
        's previous marriage end?{' '}
        <span className="end-title-span">(*Required)</span>
      </h3>
    </legend>
  );
};

DynamicSpouseNameTitle.propTypes = {
  formContext: PropTypes.object,
};
MarriageEndReasonTitle.propTypes = {
  formContext: PropTypes.object,
};
