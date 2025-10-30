import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EnteredPointOfContact = ({ value, onChange, options = [] }) => {
  // Controlled by key string in form data
  const currentKey = typeof value === 'string' ? value : 'none';

  // Keep a local selection to avoid flicker/deselect during intermediate renders
  const [selectedKey, setSelectedKey] = useState(currentKey);
  useEffect(
    () => {
      setSelectedKey(currentKey);
    },
    [currentKey],
  );

  const handleChange = e => {
    const k = e?.detail?.value;
    if (!k) return;
    setSelectedKey(k);
    onChange(k);
  };

  return (
    <div className="radio-container">
      <VaRadio
        name="previouslyEnteredPointOfContact"
        value={selectedKey}
        onVaValueChange={handleChange}
      >
        {options.map(o => (
          <VaRadioOption
            key={o.key}
            value={o.key}
            label={o.label}
            description={o.email}
          />
        ))}
      </VaRadio>
    </div>
  );
};

EnteredPointOfContact.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      email: PropTypes.string,
      data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default EnteredPointOfContact;
