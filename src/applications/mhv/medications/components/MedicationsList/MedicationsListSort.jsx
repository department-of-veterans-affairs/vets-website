import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import { rxListSortingOptions } from '../../util/constants';

const ACTIVE_REFILL_DESC = 'Active, refillable first';
const SORT_LABEL = 'Show medications in this order';

const MedicationsListSort = () => {
  const [sortOrderValue, setSortOrderValue] = useState(ACTIVE_REFILL_DESC);

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
          key={rxListSortingOptions.ACTIVE_REFILL_FIRST}
          value={rxListSortingOptions.ACTIVE_REFILL_FIRST}
          onVaSelect={e => {
            setSortOrderValue(e.detail.value);
          }}
        >
          {rxListSortingOptions.ACTIVE_REFILL_FIRST}
        </option>
      </VaSelect>
    </div>
  );
};

export default MedicationsListSort;
