import React from 'react';
import PropTypes from 'prop-types';

import { VaButtonSegmented } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { FILTER_VALUES } from '../constants';

const BUTTONS = [
  {
    label: 'In progress',
    value: FILTER_VALUES.IN_PROGRESS,
  },
  {
    label: 'Closed',
    value: FILTER_VALUES.CLOSED,
  },
  {
    label: 'All',
    value: FILTER_VALUES.ALL,
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
  selected: PropTypes.oneOf(Object.values(FILTER_VALUES)),
  onFilterChange: PropTypes.func,
};
