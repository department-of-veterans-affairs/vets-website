import React from 'react';
import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';

// Wraps the platform ArrayField to ensure undefined formData defaults to an empty array.
const SafeArrayField = props => {
  const safeFormData = Array.isArray(props.formData) ? props.formData : [];
  return <ArrayField {...props} formData={safeFormData} />;
};

export default SafeArrayField;
