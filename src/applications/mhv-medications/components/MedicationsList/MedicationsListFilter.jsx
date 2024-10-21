import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { filterOptions } from '../../util/constants';

const MedicationsListFilter = props => {
  const { updateFilter, filterOption, setFilterOption } = props;

  const handleFilterOptionChange = ({ detail }) => {
    setFilterOption(detail?.value);
  };

  const handleFilterSubmit = () => {
    updateFilter(filterOption);
  };

  const filterOptionsArray = Object.keys(filterOptions);
  return (
    <va-accordion
      bordered
      data-testid="filter-accordion"
      class="filter-accordion"
    >
      <va-accordion-item
        header="Filter"
        bordered="true"
        open={!!filterOption}
        id="filter"
      >
        <span slot="icon">
          <va-icon aria-hidden="true" icon="filter_alt" />
        </span>
        <VaRadio
          label="Select a filter"
          onVaValueChange={handleFilterOptionChange}
        >
          {filterOptionsArray.map(option => (
            <VaRadioOption
              key={`filter option ${filterOptions[option].label}`}
              label={filterOptions[option].label}
              name={filterOptions[option].name}
              value={filterOptions[option].label}
              description={filterOptions[option].description}
              checked={filterOption === filterOptions[option].label}
            />
          ))}
        </VaRadio>
        <VaButton
          className="vads-u-width--full filter-submit-btn"
          onClick={handleFilterSubmit}
          text="Filter"
        />
      </va-accordion-item>
    </va-accordion>
  );
};

MedicationsListFilter.propTypes = {
  filterOption: PropTypes.string,
  setFilterOption: PropTypes.func,
  updateFilter: PropTypes.func,
};

export default MedicationsListFilter;
