import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ALL_MEDICATIONS_FILTER_KEY } from '../../util/constants';
import { getFilterOptions } from '../../util/helpers/getRxStatus';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { setFilterOpen, setFilterOption } from '../../redux/preferencesSlice';
import {
  selectFilterOpenByDefault,
  selectFilterOption,
} from '../../selectors/selectPreferences';

const MedicationsListFilter = ({ updateFilter, filterCount }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const filterOpenByDefault = useSelector(selectFilterOpenByDefault);
  const filterOption = useSelector(selectFilterOption);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    filterOption,
  );

  const mapFilterCountToFilterLabels = label => {
    switch (label) {
      case currentFilterOptions.ALL_MEDICATIONS.label: {
        return filterCount.allMedications;
      }
      case currentFilterOptions.ACTIVE.label: {
        return filterCount.active;
      }
      case currentFilterOptions.RECENTLY_REQUESTED?.label: {
        return filterCount.recentlyRequested;
      }
      case currentFilterOptions.IN_PROGRESS?.label: {
        return filterCount.inProgress;
      }
      case currentFilterOptions.RENEWAL?.label: {
        return filterCount.renewal;
      }
      case currentFilterOptions.NON_ACTIVE?.label: {
        return filterCount.nonActive;
      }
      case currentFilterOptions.INACTIVE?.label: {
        return filterCount.inactive;
      }
      case currentFilterOptions.SHIPPED?.label: {
        return filterCount.shipped;
      }
      case currentFilterOptions.TRANSFERRED?.label: {
        return filterCount.transferred;
      }
      case currentFilterOptions.STATUS_NOT_AVAILABLE?.label: {
        return filterCount.statusNotAvailable;
      }
      default:
        return null;
    }
  };

  useEffect(
    () => {
      if (filterOpenByDefault) {
        ref.current.setAttribute('open', true);
        dispatch(setFilterOpen(false));
      }
    },
    [filterOpenByDefault, dispatch, ref],
  );

  const handleFilterOptionChange = ({ detail }) => {
    setSelectedFilterOption(detail.value);
  };

  const handleFilterSubmit = () => {
    recordEvent({
      event: 'form_radio_button_submit',
      action: 'click',
      // eslint-disable-next-line camelcase
      form_field_type: 'radio button',
      // eslint-disable-next-line camelcase
      form_field_label: 'Select a filter',
      // eslint-disable-next-line camelcase
      form_field_option_label: selectedFilterOption,
    });

    updateFilter(selectedFilterOption);
    waitForRenderThenFocus('#showingRx', document, 500);
  };

  const handleFilterReset = () => {
    updateFilter(ALL_MEDICATIONS_FILTER_KEY);
    setSelectedFilterOption(ALL_MEDICATIONS_FILTER_KEY);
    waitForRenderThenFocus('#showingRx', document, 500);
  };

  const handleAccordionItemToggle = ({ target }) => {
    if (target) {
      const isOpen = target.getAttribute('open');
      if (isOpen === 'false') {
        dispatch(
          setFilterOption(selectedFilterOption || ALL_MEDICATIONS_FILTER_KEY),
        );
      }
      datadogRum.addAction(
        dataDogActionNames.medicationsListPage.FILTER_LIST_ACCORDION,
      );
    }
  };

  const filterOptionsArray = Object.keys(currentFilterOptions);
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
              key={`filter option ${currentFilterOptions[option].label}`}
              label={`${currentFilterOptions[option].label}${
                filterCount &&
                mapFilterCountToFilterLabels(
                  currentFilterOptions[option].label,
                ) !== null
                  ? ` (${mapFilterCountToFilterLabels(
                      currentFilterOptions[option].label,
                    )})`
                  : ''
              }`}
              name="filter-options-group"
              value={option}
              description={currentFilterOptions[option].description}
              checked={selectedFilterOption === option}
              data-testid={`filter-option-${option}`}
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
  updateFilter: PropTypes.func,
};

export default MedicationsListFilter;
