import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
// import { renderLearnMoreLabel } from '../../utils/render';
// import { ariaLabels } from '../../constants';
import SearchResultTypeOfInstitutionFilter from './SearchResultTypeOfInstitutionFilter';
import {
  addAllOption,
  getStateNameForCode,
  sortOptionsByStateName,
} from '../../utils/helpers';

class InstitutionFilterForm extends React.Component {
  handleDropdownChange = e => {
    const { name: field, value } = e.target;
    this.props.handleFilterChange(field, value);
  };

  handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    this.props.handleFilterChange(field, value);
  };

  // renderProfileCautionFlagModals = () => {
  //   renderLearnMoreLabel({
  //     modal: 'cautionaryWarnings',
  //     showModal: this.props.showModal,
  //     ariaLabel: ariaLabels.learnMore.cautionaryWarning,
  //     component: this,
  //   });
  // };

  renderCategoryFilter = () => (
    <SearchResultTypeOfInstitutionFilter
      category={this.props.filters.category}
      onChange={this.handleDropdownChange}
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
        visible
      />
    );
  };

  renderCautionaryWarningsFilter = () => {
    const { filters } = this.props;

    return (
      <div>
        <p>
          Cautionary Warnings
          {/* {renderProfileCautionFlagModals()} */}
        </p>
        <Checkbox
          checked={filters.cautionFlag}
          name="cautionFlag"
          label="Exclude institutions with warnings"
          onChange={this.handleCheckboxChange}
        />
      </div>
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
        />
        <Checkbox
          checked={filters.yellowRibbonScholarship}
          name="yellowRibbonScholarship"
          label="Yellow Ribbon"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.principlesOfExcellence}
          name="principlesOfExcellence"
          label="Principles of Excellence"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.eightKeysToVeteranSuccess}
          name="eightKeysToVeteranSuccess"
          label="8 Keys to Vet Success"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.stemIndicator}
          name="stemIndicator"
          label="Rogers STEM Scholarship"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.priorityEnrollment}
          name="priorityEnrollment"
          label="Priority Enrollment"
          onChange={this.handleCheckboxChange}
        />
        <Checkbox
          checked={filters.independentStudy}
          name="independentStudy"
          label="Independent Study"
          onChange={this.handleCheckboxChange}
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
        {this.renderCautionaryWarningsFilter()}
        {this.renderProgramFilters()}
        {this.renderTypeFilter()}
      </div>
    );
  }
}

InstitutionFilterForm.propTypes = {
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
    cautionFlags: PropTypes.bool,
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
    cautionFlag: PropTypes,
  }),
};

InstitutionFilterForm.defaultProps = {};

export default InstitutionFilterForm;
