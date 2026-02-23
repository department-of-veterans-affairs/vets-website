import React from 'react';
import PropTypes from 'prop-types';

import { VaButtonSegmented } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const BUTTONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
];

export default function ClaimsFilter({ selected, onFilterChange }) {
  const handleClick = event => {
    onFilterChange?.(event.detail.value);
  };

  const selectedIndex = BUTTONS.findIndex(button => button.value === selected);

  return (
    <VaButtonSegmented
      buttons={BUTTONS}
      label="Claims status filter"
      onVaButtonClick={handleClick}
      selected={selectedIndex}
    />
  );
}

ClaimsFilter.propTypes = {
  selected: PropTypes.oneOf(['all', 'active', 'closed']),
  onFilterChange: PropTypes.func,
};
