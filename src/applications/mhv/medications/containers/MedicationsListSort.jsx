import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';

const ACTIVE_REFILL_DESC = 'Active, refillable first';
const OPTION_2 = 'option 2';
const OPTION_3 = 'option 3';
const OPTION_4 = 'option 4';
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
          value={ACTIVE_REFILL_DESC}
          onVaSelect={e => {
            setSortOrderValue(e.detail.value);
          }}
        >
          {ACTIVE_REFILL_DESC}
        </option>
        <option
          value={OPTION_2}
          onVaSelect={e => {
            setSortOrderValue(e.detail.value);
          }}
        >
          {OPTION_2}
        </option>
        <option
          value={OPTION_3}
          onVaSelect={e => {
            setSortOrderValue(e.detail.value);
          }}
        >
          {OPTION_3}
        </option>
        <option
          value={OPTION_3}
          onVaSelect={e => {
            setSortOrderValue(e.detail.value);
          }}
        >
          {OPTION_4}
        </option>
      </VaSelect>
    </div>
  );
};

export default MedicationsListSort;
