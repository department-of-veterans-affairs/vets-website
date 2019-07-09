import React from 'react';

import Dropdown from '../Dropdown';

export const DropdownFilter = ({
  label,
  name,
  alt,
  value,
  options,
  handleDropdownChange,
}) => {
  const formattedOptions = [{ value: 'ALL', label: 'ALL' }, ...options];

  return (
    <Dropdown
      label={label}
      name={name}
      options={formattedOptions}
      value={value}
      alt={alt}
      visible
      onChange={handleDropdownChange}
    />
  );
};
