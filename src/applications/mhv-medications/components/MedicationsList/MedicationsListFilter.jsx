import React, { useEffect, useRef } from 'react';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
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
  ALL_MEDICATIONS_FILTER_KEY,
  filterOptions,
  SESSION_RX_FILTER_OPEN_BY_DEFAULT,
  SESSION_SELECTED_FILTER_OPTION,
} from '../../util/constants';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { RX_IPE_FILTERING_DESCRIPTION_ID } from './InProductionEducationFiltering';

const MedicationsListFilter = props => {
  const { updateFilter, filterOption, setFilterOption, filterCount } = props;
  const ref = useRef(null);

  const mapFilterCountToFilterLabels = label => {
    switch (label) {
      case filterOptions.ALL_MEDICATIONS.label: {
        return filterCount.allMedications;
      }
      case filterOptions.ACTIVE.label: {
        return filterCount.active;
      }
      case filterOptions.RECENTLY_REQUESTED.label: {
        return filterCount.recentlyRequested;
      }
      case filterOptions.RENEWAL.label: {
        return filterCount.renewal;
      }
      case filterOptions.NON_ACTIVE.label: {
        return filterCount.nonActive;
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_RX_FILTER_OPEN_BY_DEFAULT)) {
      ref.current.setAttribute('open', true);
      sessionStorage.removeItem(SESSION_RX_FILTER_OPEN_BY_DEFAULT);
    }
  }, []);

  const handleFilterOptionChange = ({ detail }) => {
    setFilterOption(detail.value);
  };

  const handleFilterSubmit = () => {
    // Submit analytics event
    recordEvent({
      event: 'form_radio_button_submit',
      action: 'click',
      // eslint-disable-next-line camelcase
      form_field_type: 'radio button',
      // eslint-disable-next-line camelcase
      form_field_label: 'Select a filter',
      // eslint-disable-next-line camelcase
      form_field_option_label: filterOption,
    });
    updateFilter(filterOption);
    focusElement(document.getElementById('showingRx'));
  };

  const handleFilterReset = () => {
    setFilterOption(ALL_MEDICATIONS_FILTER_KEY);
    updateFilter(ALL_MEDICATIONS_FILTER_KEY);
    focusElement(document.getElementById('showingRx'));
  };

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      const isOpen = target.getAttribute('open');
      if (isOpen === 'false') {
        setFilterOption(
          sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
            ALL_MEDICATIONS_FILTER_KEY,
        );
      }
      datadogRum.addAction(
        dataDogActionNames.medicationsListPage.FILTER_LIST_ACCORDION,
      );
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
      aria-describedby={RX_IPE_FILTERING_DESCRIPTION_ID}
      uswds
    >
      <VaAccordionItem
        header="Filter list"
        bordered="true"
        id="filter"
        data-testid="rx-filter"
        ref={ref}
        level={3}
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
          enableAnalytics
        >
          {filterOptionsArray.map(option => (
            <VaRadioOption
              key={`filter option ${filterOptions[option].label}`}
              label={`${filterOptions[option].label}${
                filterCount
                  ? ` (${mapFilterCountToFilterLabels(
                      filterOptions[option].label,
                    )})`
                  : ''
              }`}
              name="filter-options-group"
              value={option}
              description={filterOptions[option].description}
              checked={filterOption === option}
              data-dd-action-name={
                dataDogActionNames.medicationsListPage[option]
              }
            />
          ))}
        </VaRadio>
        <VaButton
          className="vads-u-width--full tablet:vads-u-width--auto vads-u-margin-top--3"
          onClick={handleFilterSubmit}
          text="Apply filter"
          data-testid="filter-button"
          disableAnalytics
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.APPLY_FILTER_BUTTON
          }
        />
        <VaButton
          className="vads-u-width--full tablet:vads-u-width--auto vads-u-margin-top--3"
          secondary
          onClick={handleFilterReset}
          text="Reset filter"
          data-testid="filter-reset-button"
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.RESET_FILTER_BUTTON
          }
        />
      </VaAccordionItem>
    </VaAccordion>
  );
};

MedicationsListFilter.propTypes = {
  filterCount: PropTypes.object,
  filterOption: PropTypes.string,
  setFilterOption: PropTypes.func,
  updateFilter: PropTypes.func,
};

export default MedicationsListFilter;
