import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Checkbox from '../Checkbox';
import RadioButtons from '../RadioButtons';
import Dropdown from '../Dropdown';

export class InstitutionFilterForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderTypeFilter = this.renderTypeFilter.bind(this);
  }

  renderTypeFilter() {
    const type_facets = {
      all: Number(this.props.search.count),
      school: 0,
      employer: 0,
      ...this.props.search.facets.type
    };
    const options = [
      { value: 'all', label: `All (${type_facets.all.toLocaleString()})` },
      { value: 'school', label: `Schools only (${type_facets.school.toLocaleString()})` },
      { value: 'employer', label: `Employers only (${type_facets.employer.toLocaleString()})` }
    ];
    return (
      <RadioButtons
          label="Type of institution"
          name="type"
          options={options}
          value={this.props.filters.type}
          onChange={this.props.handleChange}/>
    );
  }

  renderCountryFilter() {
    const country_facets = {
      'ALL': this.props.search.count,
      ...this.props.search.facets.country
    };
    const options = Object.keys(country_facets).reduce((options, country) => {
      const total = Number(country_facets[country]);
      const label = `${country} (${total.toLocaleString()})`;
      return [...options, { value: country, label }];
    }, []);
    return (
      <Dropdown
          name="country"
          options={options}
          value={this.props.filters.country}
          alt="Filter results by country"
          visible
          onChange={this.props.handleChange}>
        <label htmlFor="country">
          Country
        </label>
      </Dropdown>
    );
  }

  renderStateFilter() {
    const state_facets = {
      'ALL': this.props.search.count,
      ...this.props.search.facets.state
    };
    const options = Object.keys(state_facets).reduce((options, state) => {
      const total = Number(state_facets[state]);
      const label = `${state} (${total.toLocaleString()})`;
      return [...options, { value: state, label }];
    }, []);
    return (
      <Dropdown
          name="state"
          options={options}
          value={this.props.filters.state}
          alt="Filter results by state"
          visible
          onChange={this.props.handleChange}>
        <label htmlFor="state">
          State
        </label>
      </Dropdown>
    );
  }

  renderProgramFilters() {
    const filters = this.props.filters;
    const facets = this.props.search.facets;
    const formattedCount = (key, bool) => {
      return Number(facets[key][bool.toString()]).toLocaleString();
    };
    const label = (key, desc, bool = true) => {
      return `${desc} (${formattedCount(key, bool)})`;
    };
    return (
      <div>
        <p>Programs</p>
        <Checkbox
            checked={filters.without_caution_flags}
            name="without_caution_flags"
            label={label('caution_flag', 'Without Caution Flags', false)}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.student_vet_group}
            name="student_vet_group"
            label={label('student_vet_group', 'Student Vet Group')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.yellow_ribbon_scholarship}
            name="yellow_ribbon_scholarship"
            label={label('yellow_ribbon_scholarship', 'Yellow Ribbon')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.principles_of_excellence}
            name="principles_of_excellence"
            label={label('principles_of_excellence', 'Principles of Excellence')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.eight_keys_to_veteran_success}
            name="eight_keys_to_veteran_success"
            label={label('eight_keys_to_veteran_success', '8 Keys to Vet Success')}
            onChange={this.props.handleCheckboxChange}/>
      </div>
    );
  }

  renderSchoolTypeFilter() {
    const school_type_facets = {
      'ALL': this.props.search.count,
      ...this.props.search.facets.type_name
    };
    const options = Object.keys(school_type_facets).reduce((options, type_name) => {
      const total = Number(school_type_facets[type_name]);
      const label = `${type_name} (${total.toLocaleString()})`;
      return [...options, { value: type_name, label }];
    }, []);
    return (
      <Dropdown
          name="type_name"
          options={options}
          value={this.props.filters.type_name}
          alt="Filter results by institution type"
          visible
          onChange={this.props.handleChange}>
        <label htmlFor="type_name">
          Institution type
        </label>
      </Dropdown>
    );
  }

  render() {
    return (
      <div className="institution-filter-form">
        <h2>Institution details</h2>
        {this.renderTypeFilter()}
        {this.renderCountryFilter()}
        {this.renderStateFilter()}
        {this.renderProgramFilters()}
        {this.renderSchoolTypeFilter()}
      </div>
    );
  }

}

InstitutionFilterForm.defaultProps = {};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
    hideModal: () => {
      dispatch(actions.displayModal(null));
    },
    handleChange: (e) => {
      dispatch(actions.institutionFilterChange(e));
    },
    handleCheckboxChange: (e) => {
      dispatch(actions.institutionProgramFilterChange(e));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InstitutionFilterForm);
