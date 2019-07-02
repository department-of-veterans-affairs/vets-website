import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

class VetTecFilterForm extends React.Component {
  handleDropdownChange = e => {
    const { name: field, value } = e.target;
    this.props.onFilterChange(field, value);
  };

  handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    this.props.onFilterChange(field, value);
  };

  renderCountryFilter = () => {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...this.props.search.facets.country.map(country => ({
        value: country.name,
        label: country.name,
      })),
    ];

    return (
      <Dropdown
        label="Country"
        name="country"
        options={options}
        value={this.props.filters.country}
        alt="Filter results by country"
        visible
        onChange={this.handleDropdownChange}
      />
    );
  };

  renderStateFilter = () => {
    const options = [
      { value: 'ALL', label: 'ALL' },
      ...Object.keys(this.props.search.facets.state).map(state => ({
        value: state,
        label: state,
      })),
    ];

    return (
      <Dropdown
        label="State"
        name="state"
        options={options}
        value={this.props.filters.state}
        alt="Filter results by state"
        visible
        onChange={this.handleDropdownChange}
      />
    );
  };

  renderLearningFormat = () => {
    const filters = this.props.filters;
    return (
      <div>
        <p>Learning Format</p>
        <Checkbox
          checked={filters.vetTecInPerson}
          name="inPerson"
          label="In Person"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.online}
          name="yellowRibbonScholarship"
          label="Yellow Ribbon"
          onChange={this.handleCheckboxChange}
        />
      </div>
    );
  };

  render() {
    return (
      <div className="vettec-filter-form">
        <h2>VET TEC Details</h2>
        {this.renderCountryFilter()}
        {this.renderStateFilter()}
        {this.renderLearningFormat()}
      </div>
    );
  }
}

VetTecFilterForm.propTypes = {
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
    stemOffered: PropTypes.bool,
  }),
  onFilterChange: PropTypes.func,
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
    stemOffered: PropTypes.object,
  }),
};

VetTecFilterForm.defaultProps = {};

export default VetTecFilterForm;
