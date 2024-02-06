import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const sortOptions = [
  {
    label: 'Disability rating ascending',
    value: 'ratingPercentage.asc',
  },
  {
    label: 'Disability rating descending',
    value: 'ratingPercentage.desc',
  },
  {
    label: 'Effective date ascending',
    value: 'effectiveDate.asc',
  },
  {
    label: 'Effective date descending',
    value: 'effectiveDate.desc',
  },
];

const SortSelect = ({ onSelect, sortBy }) => {
  const handleSelect = e => {
    onSelect(e.target.value);
  };

  return (
    <VaSelect
      error={null}
      label="Sort by"
      name="sort-by"
      value={sortBy}
      onVaSelect={handleSelect}
      uswds="false"
    >
      {sortOptions.map(({ label, value }, i) => (
        <option key={i} value={value}>
          {label}
        </option>
      ))}
    </VaSelect>
  );
};

SortSelect.propTypes = {
  sortBy: PropTypes.string,
  onSelect: PropTypes.func,
};

export default SortSelect;
