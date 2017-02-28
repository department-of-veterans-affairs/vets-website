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
    const typeFacets = {
      all: Number(this.props.search.count),
      school: 0,
      employer: 0,
      ...this.props.search.facets.type
    };
    const options = [
      { value: 'all', label: `All (${typeFacets.all.toLocaleString()})` },
      { value: 'school', label: `Schools only (${typeFacets.school.toLocaleString()})` },
      { value: 'employer', label: `Employers only (${typeFacets.employer.toLocaleString()})` }
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
    const countryFacets = {
      ALL: this.props.search.count,
      ...this.props.search.facets.country
    };
    const options = Object.keys(countryFacets).reduce((opts, country) => {
      const total = Number(countryFacets[country]);
      const label = `${country} (${total.toLocaleString()})`;
      return [...opts, { value: country, label }];
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
    const stateFacets = {
      ALL: this.props.search.count,
      ...this.props.search.facets.state
    };
    const options = Object.keys(stateFacets).reduce((opts, state) => {
      const total = Number(stateFacets[state]);
      const label = `${state} (${total.toLocaleString()})`;
      return [...opts, { value: state, label }];
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
            checked={filters.withoutCautionFlags}
            name="withoutCautionFlags"
            label={label('cautionFlag', 'Without Caution Flags', false)}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.studentVetGroup}
            name="studentVetGroup"
            label={label('studentVetGroup', 'Student Vet Group')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.yellowRibbonScholarship}
            name="yellowRibbonScholarship"
            label={label('yellowRibbonScholarship', 'Yellow Ribbon')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.principlesOfExcellence}
            name="principlesOfExcellence"
            label={label('principlesOfExcellence', 'Principles of Excellence')}
            onChange={this.props.handleCheckboxChange}/>
        <Checkbox
            checked={filters.eightKeysToVeteranSuccess}
            name="eightKeysToVeteranSuccess"
            label={label('eightKeysToVeteranSuccess', '8 Keys to Vet Success')}
            onChange={this.props.handleCheckboxChange}/>
      </div>
    );
  }

  renderSchoolTypeFilter() {
    const schoolTypeFacets = {
      ALL: this.props.search.count,
      ...this.props.search.facets.typeName
    };
    const options = Object.keys(schoolTypeFacets).reduce((opts, typeName) => {
      const total = Number(schoolTypeFacets[typeName]);
      const label = `${typeName} (${total.toLocaleString()})`;
      return [...opts, { value: typeName, label }];
    }, []);
    return (
      <Dropdown
          name="typeName"
          options={options}
          value={this.props.filters.typeName}
          alt="Filter results by institution type"
          visible
          onChange={this.props.handleChange}>
        <label htmlFor="typeName">
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
      dispatch(actions.showModal(name));
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
