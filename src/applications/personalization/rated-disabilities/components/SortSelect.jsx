import React from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from 'web-components/react-bindings';

const sortOptions = [
  {
    label: 'Disability Rating Ascending',
    value: 'ratingPercentage.asc',
  },
  {
    label: 'Disability Rating Descending',
    value: 'ratingPercentage.desc',
  },
  {
    label: 'Effective Date Ascending',
    value: 'effectiveDate.asc',
  },
  {
    label: 'Effective Date Descending',
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
