import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SearchAccordion from '../../components/SearchAccordion';
import Dropdown from '../../components/Dropdown';
import {
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
} from '../../utils/helpers';
import { showModal, filterChange } from '../../actions';
import { TABS } from '../../constants';
import { updateUrlParams } from '../../selectors/search';

export function FilterByLocation({
  dispatchFilterChange,
  filters,
  preview,
  search,
  smallScreen,
}) {
  const history = useHistory();
  const { version } = preview;
  const { expanded, country, state } = filters;

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;

  const updateInstitutionFilters = (name, value) => {
    dispatchFilterChange({ ...filters, [name]: value });
  };

  const onChange = e => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.value,
    });
    updateInstitutionFilters(e.target.name, e.target.value);
  };

  const onAccordionChange = value => {
    recordEvent({
      event: value ? 'int-accordion-expand' : 'int-accordion-collapse',
    });
    updateInstitutionFilters('expanded', value);
  };

  const updateResults = () => {
    updateInstitutionFilters('search', true);

    updateUrlParams(history, search.tab, search.query, filters, version);
  };

  const renderCountryFilter = () => {
    const options = facets.country.map(facetCountry => ({
      optionValue: facetCountry.name,
      optionLabel: facetCountry.name,
    }));

    return (
      <Dropdown
        label="Country"
        name="country"
        alt="Filter results by country"
        options={addAllOption(options)}
        value={country}
        onChange={onChange}
        visible
      />
    );
  };

  const renderStateFilter = () => {
    const options = Object.keys(facets.state)
      .map(facetState => ({
        optionValue: facetState,
        optionLabel: getStateNameForCode(facetState),
      }))
      .sort(sortOptionsByStateName);
    return (
      <Dropdown
        label="State"
        name="state"
        alt="Filter results by state"
        options={addAllOption(options)}
        value={state}
        onChange={onChange}
        visible
      />
    );
  };

  const renderLocation = () => {
    return (
      <>
        <h3>Location</h3>
        {renderCountryFilter()}
        {renderStateFilter()}
      </>
    );
  };

  const controls = <div>{renderLocation()}</div>;

  const title = 'Filter by location';

  return (
    <div className="filter-your-results vads-u-margin-bottom--2">
      {!smallScreen && (
        <SearchAccordion
          button={title}
          buttonLabel="Update results"
          buttonOnClick={() => updateResults()}
          expanded={expanded}
          onClick={onAccordionChange}
        >
          {search.inProgress && (
            <VaLoadingIndicator
              data-testid="loading-indicator"
              message="Loading..."
            />
          )}
          {!search.inProgress && controls}
        </SearchAccordion>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  filters: state.filters,
  search: state.search,
  preview: state.preview,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchFilterChange: filterChange,
};
FilterByLocation.propTypes = {
  dispatchFilterChange: PropTypes.func,
  filters: PropTypes.object,
  preview: PropTypes.object,
  search: PropTypes.object,
  smallScreen: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterByLocation);
