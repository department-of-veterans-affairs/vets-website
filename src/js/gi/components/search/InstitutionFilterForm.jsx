import React from 'react';

import Checkbox from '../Checkbox';
import RadioButtons from '../RadioButtons';
import Dropdown from '../Dropdown';

class InstitutionFilterForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.renderCategoryFilter = this.renderCategoryFilter.bind(this);
    this.renderCountryFilter = this.renderCountryFilter.bind(this);
    this.renderStateFilter = this.renderStateFilter.bind(this);
    this.renderProgramFilters = this.renderProgramFilters.bind(this);
    this.renderTypeFilter = this.renderTypeFilter.bind(this);
  }

  handleDropdownChange(e) {
    const { name: field, value } = e.target;
    this.props.onFilterChange(field, value);
  }

  handleCheckboxChange(e) {
    const { name: field, checked: value } = e.target;
    this.props.onFilterChange(field, value);
  }

  renderCategoryFilter() {
    const options = [
      { value: 'ALL', label: 'All' },
      { value: 'school', label: 'Schools only' },
      { value: 'employer', label: 'Employers only' }
    ];

    return (
      <RadioButtons
          label="Type of institution"
          name="category"
          options={options}
          value={this.props.filters.category}
          onChange={this.handleDropdownChange}/>
    );
  }

  renderCountryFilter() {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...this.props.search.facets.country.map(country => ({
        value: country.name,
        label: country.name
      }))
    ];

    return (
      <Dropdown
          label="Country"
          name="country"
          options={options}
          value={this.props.filters.country}
          alt="Filter results by country"
          visible
          onChange={this.handleDropdownChange}/>
    );
  }

  renderStateFilter() {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...Object.keys(this.props.search.facets.state).map(state => ({
        value: state,
        label: state
      }))
    ];

    return (
      <Dropdown
          label="State"
          name="state"
          options={options}
          value={this.props.filters.state}
          alt="Filter results by state"
          visible
          onChange={this.handleDropdownChange}/>
    );
  }

  renderProgramFilters() {
    const filters = this.props.filters;

    return (
      <div>
        <p>Programs</p>
        <Checkbox
            checked={filters.caution}
            name="caution"
            label="Without Caution Flags"
            onChange={this.handleCheckboxChange}/>
        <Checkbox
            checked={filters.studentVeteranGroup}
            name="studentVeteranGroup"
            label="Student Vet Group"
            onChange={this.handleCheckboxChange}/>
        <Checkbox
            checked={filters.yellowRibbonScholarship}
            name="yellowRibbonScholarship"
            label="Yellow Ribbon"
            onChange={this.handleCheckboxChange}/>
        <Checkbox
            checked={filters.principlesOfExcellence}
            name="principlesOfExcellence"
            label="Principles of Excellence"
            onChange={this.handleCheckboxChange}/>
        <Checkbox
            checked={filters.eightKeysToVeteranSuccess}
            name="eightKeysToVeteranSuccess"
            label="8 Keys to Vet Success"
            onChange={this.handleCheckboxChange}/>
      </div>
    );
  }

  renderTypeFilter() {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...Object.keys(this.props.search.facets.type).map(type => ({
        value: type,
        label: type
      }))
    ];

    return (
      <Dropdown
          label="Institution type"
          name="type"
          options={options}
          value={this.props.filters.type}
          alt="Filter results by institution type"
          visible
          onChange={this.handleDropdownChange}/>
    );
  }

  render() {
    return (
      <div className="institution-filter-form">
        <h2>Institution details</h2>
        {this.renderCategoryFilter()}
        {this.renderCountryFilter()}
        {this.renderStateFilter()}
        {this.renderProgramFilters()}
        {this.renderTypeFilter()}
      </div>
    );
  }

}

InstitutionFilterForm.propTypes = {
  filters: React.PropTypes.shape({
    category: React.PropTypes.string,
    type: React.PropTypes.string,
    country: React.PropTypes.string,
    state: React.PropTypes.string,
    withoutCautionFlags: React.PropTypes.bool,
    studentVetGroup: React.PropTypes.bool,
    yellowRibbonScholarship: React.PropTypes.bool,
    principlesOfExcellence: React.PropTypes.bool,
    eightKeysToVeteranSuccess: React.PropTypes.bool,
  }),
  onFilterChange: React.PropTypes.func,
  search: React.PropTypes.shape({
    category: React.PropTypes.object,
    type: React.PropTypes.object,
    state: React.PropTypes.object,
    country: React.PropTypes.object,
    cautionFlag: React.PropTypes.object,
    studentVetGroup: React.PropTypes.object,
    yellowRibbonScholarship: React.PropTypes.object,
    principlesOfExcellence: React.PropTypes.object,
    eightKeysToVeteranSuccess: React.PropTypes.object
  })
};

InstitutionFilterForm.defaultProps = {};

export default InstitutionFilterForm;
