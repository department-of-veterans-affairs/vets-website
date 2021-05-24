import React, { useState } from 'react';
import SearchAccordion from '../components/SearchAccordion';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';

import {
  getStateNameForCode,
  sortOptionsByStateName,
} from '../../gi/utils/helpers';
import {
  showModal,
  institutionFilterChange,
  fetchSearchByNameResults,
} from '../actions';
import { connect } from 'react-redux';
import { useQueryParams, addAllOption } from '../utils/helpers';

export function RefineYourSearch({
  dispatchInstitutionFilterChange,
  dispatchShowModal,
  filters,
  search,
  fetchSearchByName,
  preview,
}) {
  const [openName, setOpenName] = useState('');
  const queryParams = useQueryParams();
  const { version } = preview;

  const handleAccordionDropdownOpen = openedName => {
    setOpenName(openedName);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = filters;
    newFilters[field] = value;

    dispatchInstitutionFilterChange(newFilters);
  };

  const handleDropdownChange = e => {
    const { name: field, value } = e.target;
    handleFilterChange(field, value);
  };

  const handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    handleFilterChange(field, value);
  };

  const handleVetTecCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    handleFilterChange(field, value);
    if (filters.preferredProvider && !filters.vettec) {
      if (field === 'preferredProvider') {
        handleFilterChange('vettec', true);
      } else {
        handleFilterChange('preferredProvider', false);
      }
    }
  };

  const updateResults = () => {
    queryParams.delete('page');

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (!value || value === 'ALL') {
        queryParams.delete(key);
      } else {
        queryParams.set(key, value);
      }
    });

    const searchFilters = filters;

    Object.keys(searchFilters).forEach(function(key) {
      if (!Array.from(queryParams.keys()).includes(key)) {
        delete searchFilters[key];
      } else {
        searchFilters[key] = queryParams.get(key);
      }
    });

    fetchSearchByName(search.query.name, searchFilters, version);
  };

  const renderTypeOfInstitution = () => {
    return (
      <>
        <h3>Type of institution</h3>
        <Checkbox
          checked={filters.schools}
          name="schools"
          label="Schools"
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.employers}
          name="employers"
          label="Employers (on the job training and apprenticeships)"
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.vettec}
          name="vettec"
          label="VET TEC providers"
          onChange={handleVetTecCheckboxChange}
        />
        <div className="vads-u-padding-left--3">
          <Checkbox
            checked={filters.preferredProvider}
            name="preferredProvider"
            label="Preferred providers"
            onChange={handleVetTecCheckboxChange}
          />
        </div>
      </>
    );
  };

  const renderCountryFilter = () => {
    const options = search.facets.country.map(country => ({
      optionValue: country.name,
      optionLabel: country.name,
    }));

    return (
      <Dropdown
        label="Country"
        name="country"
        alt="Filter results by country"
        options={addAllOption(options)}
        value={filters.country}
        onChange={handleDropdownChange}
        visible
      />
    );
  };

  const renderStateFilter = () => {
    const options = Object.keys(search.facets.state).map(state => ({
      optionValue: state,
      optionLabel: getStateNameForCode(state),
    }));
    const sortedOptions = options.sort(sortOptionsByStateName);
    return (
      <Dropdown
        label="State"
        name="state"
        alt="Filter results by state"
        options={addAllOption(sortedOptions)}
        value={filters.state}
        onChange={handleDropdownChange}
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

  const renderSchoolAttributes = () => {
    return (
      <>
        <h3>School attributes</h3>
        <p>About the school</p>
        <Checkbox
          checked={filters.excludeWarnings}
          name="excludeWarnings"
          label={
            <LearnMoreLabel
              text="Has no cautionary warnings"
              onClick={() => dispatchShowModal('cautionaryWarnings')}
              ariaLabel="Learn more about VA education and training programs"
            />
          }
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.accredited}
          name="accredited"
          label={
            <LearnMoreLabel
              text="Is accredited"
              onClick={() => dispatchShowModal('accredited')}
              ariaLabel="Learn more about VA education and training programs"
            />
          }
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.studentVeteranGroup}
          name="studentVeteranGroup"
          label="Has a Student Veteran Group"
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.yellowRibbonScholarship}
          name="yellowRibbonScholarship"
          label="Offers Yellow Ribbon Program"
          onChange={handleCheckboxChange}
        />
      </>
    );
  };

  const renderTypeOfSchool = () => {
    const options = [
      ...Object.keys(search.facets.type).map(type => ({
        optionValue: type,
        optionLabel: type,
      })),
    ];

    return (
      <Dropdown
        label="Type of school"
        name="type"
        options={addAllOption(options)}
        value={filters.type}
        alt="Filter results by institution type"
        visible
        onChange={handleDropdownChange}
      />
    );
  };

  const renderSchoolMission = () => {
    return (
      <>
        <p>School mission</p>
        <Checkbox
          checked={filters.hbcu}
          name="hbcu"
          label="Historically Black Colleges and Universities"
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.singleGenderSchool}
          name="singleGenderSchool"
          label="Single gender school"
          onChange={handleCheckboxChange}
        />
        <Checkbox
          checked={filters.isRelaffil}
          name="isRelaffil"
          label="Religious affiliation"
          onChange={handleCheckboxChange}
        />
      </>
    );
  };

  return (
    <div>
      <SearchAccordion
        button="Refine your search"
        buttonLabel="Update results"
        buttonOnClick={() => updateResults()}
        name="benefitEstimates"
        openName={openName}
        onOpen={handleAccordionDropdownOpen}
        displayCancel
      >
        <br />
        {renderTypeOfInstitution()}
        {renderLocation()}
        {renderSchoolAttributes()}
        {renderTypeOfSchool()}
        {renderSchoolMission()}
      </SearchAccordion>
    </div>
  );
}

const mapStateToProps = state => ({
  eligibility: state.eligibility,
  filters: state.filters,
  search: state.search,
  preview: state.preview,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchInstitutionFilterChange: institutionFilterChange,
  fetchSearchByName: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RefineYourSearch);
