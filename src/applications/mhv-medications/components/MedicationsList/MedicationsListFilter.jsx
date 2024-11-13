import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  filterOptions,
  SESSION_SELECTED_FILTER_OPTION,
} from '../../util/constants';

const MedicationsListFilter = props => {
  const { updateFilter, filterOption, setFilterOption } = props;

  const handleFilterOptionChange = ({ detail }) => {
    setFilterOption(detail.value);
  };

  const handleFilterSubmit = () => {
    updateFilter(filterOption);
    focusElement(document.getElementById('showingRx'));
  };

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      const isOpen = target.getAttribute('open');
      if (isOpen === 'false') {
        setFilterOption(
          sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) || null,
        );
      }
    }
  };

  const filterOptionsArray = Object.keys(filterOptions);
  return (
    <VaAccordion
      bordered
      open-single
      data-testid="filter-accordion"
      class="filter-accordion"
      onAccordionItemToggled={handleAccordionItemToggle}
      uswds
    >
      <VaAccordionItem
        header="Filter list"
        bordered="true"
        open={!!filterOption}
        id="filter"
        data-testid="rx-filter"
        uswds
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
              value={filterOptions[option].url}
              description={filterOptions[option].description}
              checked={filterOption === filterOptions[option].url}
            />
          ))}
        </VaRadio>
        <VaButton
          className="vads-u-width--full tablet:vads-u-width--auto filter-submit-btn vads-u-margin-top--3"
          onClick={handleFilterSubmit}
          text="Filter"
          data-testid="filter-button"
        />
      </VaAccordionItem>
    </VaAccordion>
  );
};

MedicationsListFilter.propTypes = {
  filterOption: PropTypes.string,
  setFilterOption: PropTypes.func,
  updateFilter: PropTypes.func,
};

export default MedicationsListFilter;
