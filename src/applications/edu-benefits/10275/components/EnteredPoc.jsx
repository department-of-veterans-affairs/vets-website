import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EnteredPoc = ({ value, onChange, options = [] }) => {
  // Controlled by key stored in form data object or simple string fallback
  let currentKey = '';
  if (typeof value === 'string') {
    currentKey = value;
  } else if (value && typeof value === 'object' && value.key) {
    currentKey = value.key;
  }

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
    const selected = options.find(o => o.key === k);
    // Pass the full data object to the form system
    onChange(selected?.data ?? { key: k });
  };
  return (
    <div className="radio-container">
      <VaRadio
        name="pointOfContact"
        value={selectedKey}
        onVaValueChange={handleChange}
      >
        {options.map(o => (
          <VaRadioOption
            name="pointOfContact"
            key={o.key}
            value={o.key}
            checked={!!o.key && selectedKey === o.key}
            label={o.label}
            description={o.email}
          />
        ))}
      </VaRadio>
    </div>
  );
};

EnteredPoc.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      email: PropTypes.string,
      data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
};

export default EnteredPoc;
