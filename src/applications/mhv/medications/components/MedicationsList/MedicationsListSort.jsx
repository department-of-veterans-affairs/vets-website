import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { rxListSortingOptions } from '../../util/constants';

const ACTIVE_REFILL_DESC = 'Active, refillable first';
const SORT_LABEL = 'Show medications in this order';

const MedicationsListSort = props => {
  const { setSortOption } = props;

  const [sortOrderValue, setSortOrderValue] = useState(ACTIVE_REFILL_DESC);

  useEffect(
    () => {
      if (sortOrderValue) {
        setSortOption(sortOrderValue);
      }
    },
    [setSortOption, sortOrderValue],
  );
  return (
    <div className="medications-list-sort">
      <VaSelect
        id="sort-order-dropdown"
        label={SORT_LABEL}
        name="sort-order"
        value={{ sortOrderValue }}
        onVaSelect={e => {
          setSortOrderValue(e.detail.value);
        }}
      >
        {rxListSortingOptions.map((option, i) => {
          const optionProperties = Object.keys(option);
          return (
            <option
              key={`sort option ${i}`}
              value={option[optionProperties[0]].value}
              onVaSelect={e => {
                setSortOption(e.detail.value);
              }}
            >
              {option[optionProperties[0]].label}
            </option>
          );
        })}
      </VaSelect>
    </div>
  );
};

MedicationsListSort.propTypes = {
  setSortOption: PropTypes.func,
};

export default MedicationsListSort;
