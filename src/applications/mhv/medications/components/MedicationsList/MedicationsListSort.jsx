import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import PropTypes from 'prop-types';
import { rxListSortingOptions } from '../../util/constants';

const MedicationsListSort = props => {
  const { setSortOption, defaultSortOption, sortRxList } = props;

  return (
    <div className="medications-list-sort">
      <VaSelect
        id="sort-order-dropdown"
        label="Show medications in this order"
        name="sort-order"
        value={defaultSortOption}
        onVaSelect={e => {
          setSortOption(e.detail.value);
        }}
      >
        {rxListSortingOptions.map((option, i) => {
          const optionProperties = Object.keys(option);
          return (
            <option
              key={`option-${i}`}
              value={option[optionProperties[0]].value}
            >
              {option[optionProperties[0]].label}
            </option>
          );
        })}
      </VaSelect>
      <div className="sort-button">
        <button type="button" onClick={sortRxList}>
          Sort
        </button>
      </div>
    </div>
  );
};

MedicationsListSort.propTypes = {
  defaultSortOption: PropTypes.string,
  setSortOption: PropTypes.func,
  sortRxList: PropTypes.func,
};

export default MedicationsListSort;
