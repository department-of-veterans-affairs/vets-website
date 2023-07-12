import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect } from 'react';
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
  // console.log('sortOrderValue: ', sortOrderValue);
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
        <option
          key="lskj"
          value="active"
          onVaSelect={e => {
            // setSortOrderValue(e.detail.value);
            setSortOption(e.detail.value);
          }}
          onSelect={e => {
            // setSortOrderValue(e.detail.value);
            setSortOption(e.detail.value);
          }}
        >
          Active
        </option>
        <option
          key={rxListSortingOptions.ACTIVE_REFILL_FIRST}
          value={rxListSortingOptions.ACTIVE_REFILL_FIRST}
          onVaSelect={e => {
            // setSortOrderValue(e.detail.value);
            setSortOption(e.detail.value);
          }}
        >
          {rxListSortingOptions.ACTIVE_REFILL_FIRST}
        </option>
      </VaSelect>
    </div>
  );
};

export default MedicationsListSort;
