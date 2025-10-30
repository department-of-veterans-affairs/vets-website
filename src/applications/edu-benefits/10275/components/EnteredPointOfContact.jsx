import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EnteredPointOfContact = ({ value, onChange, options = [] }) => {
  const byKey = Object.fromEntries(options.map(o => [o.key, o]));
  const keyByData = new Map(options.map(o => [JSON.stringify(o.data), o.key]));
  const currentKey = (() => {
    if (value === 'none') return 'none';
    if (value && typeof value === 'object') {
      const k = keyByData.get(JSON.stringify(value));
      return k || 'none';
    }
    return 'none';
  })();

  const handleChange = e => {
    const k = e?.detail?.value;
    if (!k) return;
    const opt = byKey[k];
    if (!opt) return;
    onChange(opt.data);
  };

  return (
    <VaRadio
      name="previouslyEnteredPointOfContact"
      value={currentKey}
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
  );
};

EnteredPointOfContact.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      label: PropTypes.string,
      email: PropTypes.string,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
};

export default EnteredPointOfContact;
