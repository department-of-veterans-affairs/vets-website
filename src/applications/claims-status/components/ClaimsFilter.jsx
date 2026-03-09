import React from 'react';
import PropTypes from 'prop-types';

import { VaButtonSegmented } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const BUTTONS = [
  {
    label: 'In progress',
    value: 'in progress',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
  {
    label: 'All',
    value: 'all',
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
  selected: PropTypes.oneOf(['in progress', 'closed', 'all']),
  onFilterChange: PropTypes.func,
};
