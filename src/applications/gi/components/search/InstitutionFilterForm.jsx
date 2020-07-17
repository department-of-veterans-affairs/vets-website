import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import SearchResultTypeOfInstitutionFilter from './SearchResultTypeOfInstitutionFilter';
import {
  addAllOption,
  getStateNameForCode,
  sortOptionsByStateName,
} from '../../utils/helpers';
import CautionaryWarningsFilter from './CautionaryWarningsFilter';

class InstitutionFilterForm extends React.Component {
  handleDropdownChange = e => {
    const { name: field, value } = e.target;
    this.props.handleFilterChange(field, value);
  };

  handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    this.props.handleFilterChange(field, value);
  };

  renderCategoryFilter = () => (
    <SearchResultTypeOfInstitutionFilter
      category={this.props.filters.category}
      onChange={this.handleDropdownChange}
      handleInputFocus={this.props.handleInputFocus}
      displayAllOption
    />
  );

  renderCountryFilter = () => {
    const options = this.props.search.facets.country.map(country => ({
      value: country.name,
      label: country.name,
    }));

    return (
      <Dropdown
        label="Country"
        name="country"
        alt="Filter results by country"
        options={addAllOption(options)}
        value={this.props.filters.country}
        onChange={this.handleDropdownChange}
        onFocus={this.props.handleInputFocus}
        visible
      />
    );
  };

  renderStateFilter = () => {
    const options = Object.keys(this.props.search.facets.state).map(state => ({
      value: state,
      label: getStateNameForCode(state),
    }));
    const sortedOptions = options.sort(sortOptionsByStateName);
    return (
      <Dropdown
        label="State"
        name="state"
        alt="Filter results by state"
        options={addAllOption(sortedOptions)}
        value={this.props.filters.state}
        onChange={this.handleDropdownChange}
        onFocus={this.props.handleInputFocus}
        visible
      />
    );
  };

  renderProgramFilters = () => {
    const { filters } = this.props;

    return (
      <div>
        <p>Programs</p>
        <Checkbox
          checked={filters.studentVeteranGroup}
          name="studentVeteranGroup"
          label="Student Vet Group"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.yellowRibbonScholarship}
          name="yellowRibbonScholarship"
          label="Yellow Ribbon"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.principlesOfExcellence}
          name="principlesOfExcellence"
          label="Principles of Excellence"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.eightKeysToVeteranSuccess}
          name="eightKeysToVeteranSuccess"
          label="8 Keys to Vet Success"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.stemIndicator}
          name="stemIndicator"
          label="Rogers STEM Scholarship"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.priorityEnrollment}
          name="priorityEnrollment"
          label="Priority Enrollment"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
        <Checkbox
          checked={filters.independentStudy}
          name="independentStudy"
          label="Independent Study"
          onChange={this.handleCheckboxChange}
          onFocus={this.props.handleInputFocus}
        />
      </div>
    );
  };

  renderTypeFilter = () => {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...Object.keys(this.props.search.facets.type).map(type => ({
        value: type,
        label: type,
      })),
    ];

    return (
      <Dropdown
        label="Institution type"
        name="type"
        options={options}
        value={this.props.filters.type}
        alt="Filter results by institution type"
        visible
        onChange={this.handleDropdownChange}
        onFocus={this.props.handleInputFocus}
      />
    );
  };

  render() {
    return (
      <div className="institution-filter-form">
        <h2>Institution details</h2>
        {this.renderCategoryFilter()}
        {this.renderCountryFilter()}
        {this.renderStateFilter()}
        {
          <CautionaryWarningsFilter
            excludeCautionFlags={this.props.filters.excludeCautionFlags}
            excludeWarnings={this.props.filters.excludeWarnings}
            onChange={this.handleCheckboxChange}
            showModal={this.props.showModal}
            handleInputFocus={this.props.handleInputFocus}
          />
        }
        {this.renderProgramFilters()}
        {this.renderTypeFilter()}
      </div>
    );
  }
}

InstitutionFilterForm.propTypes = {
  showModal: PropTypes.func,
  filters: PropTypes.shape({
    category: PropTypes.string,
    distanceLearning: PropTypes.bool,
    type: PropTypes.string,
    country: PropTypes.string,
    priorityEnrollment: PropTypes.bool,
    independentStudy: PropTypes.bool,
    state: PropTypes.string,
    studentVetGroup: PropTypes.bool,
    yellowRibbonScholarship: PropTypes.bool,
    onlineLearning: PropTypes.bool,
    principlesOfExcellence: PropTypes.bool,
    eightKeysToVeteranSuccess: PropTypes.bool,
    stemIndicator: PropTypes.bool,
    excludeWarnings: PropTypes.bool,
    excludeCautionFlags: PropTypes.bool,
  }),
  handleFilterChange: PropTypes.func,
  search: PropTypes.shape({
    category: PropTypes.object,
    distanceLearning: PropTypes.object,
    type: PropTypes.object,
    state: PropTypes.object,
    country: PropTypes.object,
    studentVetGroup: PropTypes.object,
    yellowRibbonScholarship: PropTypes.object,
    principlesOfExcellence: PropTypes.object,
    eightKeysToVeteranSuccess: PropTypes.object,
    onlineLearning: PropTypes.bool,
    priorityEnrollment: PropTypes.object,
    independentStudy: PropTypes.object,
    stemIndicator: PropTypes.object,
    excludeWarnings: PropTypes.bool,
    excludeCautionFlags: PropTypes.bool,
  }),
  handleInputFocus: PropTypes.func,
};

InstitutionFilterForm.defaultProps = {};

export default InstitutionFilterForm;
