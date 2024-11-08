import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { filterOptions, SESSION_SELECTED_FILTER_OPTION } from '../../util/constants';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const MedicationsListFilter = props => {
  const { updateFilter, filterOption, setFilterOption } = props;

  const handleFilterOptionChange = ({ detail }) => {
    setFilterOption(detail?.value);
  };

  const handleFilterSubmit = () => {
    updateFilter(filterOption);
    focusElement(document.getElementById('showingRx'));
  };

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      const isOpen = target.getAttribute('open');
      if (!isOpen) {
        setFilterOption(sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) || null);
      }
    }
  }

  const filterOptionsArray = Object.keys(filterOptions);
  return (
    <va-accordion
      bordered
      open-single
      data-testid="filter-accordion"
      class="filter-accordion"
      onAccordionItemToggled={handleAccordionItemToggle}
    >
      <va-accordion-item
        header="Filter list"
        bordered="true"
        open={!!filterOption}
        id="filter"
        data-testid="rx-filter"
      >
        <span slot="icon">
          <va-icon aria-hidden="true" icon="filter_alt" />
        </span>
        <VaRadio
          label="Select a filter"
          data-testid="filter-option"
          onVaValueChange={handleFilterOptionChange}
          className="vads-u-margin-top--0"
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
          className="vads-u-width--full tablet:vads-u-width--auto filter-submit-btn vads-u-margin-top--3"
          onClick={handleFilterSubmit}
          text="Filter"
          data-testid="filter-button"
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
