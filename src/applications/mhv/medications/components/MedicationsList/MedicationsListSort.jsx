import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { rxListSortingOptions } from '../../util/constants';

const MedicationsListSort = props => {
  const { value, sortRxList } = props;
  const [sortListOption, setSortListOption] = useState(value);

  const rxSortingOptions = Object.values(rxListSortingOptions);

  const handleSelect = i => {
    setSortListOption(rxSortingOptions[i]);
  };

  return (
    <div className="medications-list-sort">
      <VaSelect
        id="sort-order-dropdown"
        label="Show medications in this order"
        name="sort-order"
        value={sortListOption}
        onVaSelect={e => {
          handleSelect(e.detail.value);
        }}
      >
        {rxSortingOptions.map((option, i) => {
          return (
            <option key={`option-${i}`} value={i} data-testid="sort-option">
              {option.LABEL}
            </option>
          );
        })}
      </VaSelect>
      <div className="sort-button">
        <button
          type="button"
          className="vads-u-line-height--4"
          onClick={() => {
            sortRxList(sortListOption);
          }}
        >
          Sort
        </button>
      </div>
    </div>
  );
};

MedicationsListSort.propTypes = {
  sortRxList: PropTypes.func,
  value: PropTypes.object,
};

export default MedicationsListSort;
