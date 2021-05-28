import React, { useState } from 'react';
import SearchAccordion from '../components/SearchAccordion';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';

import {
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
} from '../utils/helpers';
import {
  showModal,
  updateFiltersAndDoNameSearch,
  updateFiltersAndDoLocationSearch,
} from '../actions';
import { connect } from 'react-redux';

import { TABS } from '../constants';

export function RefineYourSearch({
  dispatchShowModal,
  dispatchUpdateFiltersAndDoNameSearch,
  dispatchUpdateFiltersAndDoLocationSearch,
  filters,
  preview,
  search,
}) {
  const [openName, setOpenName] = useState('');
  const [accredited, setAccredited] = useState(filters.accredited);
  const [studentVeteranGroup, setStudentVeteranGroup] = useState(
    filters.studentVeteranGroup,
  );
  const [yellowRibbonScholarship, setYellowRibbonScholarship] = useState(
    filters.yellowRibbonScholarship,
  );
  const [singleGenderSchool, setSingleGenderSchool] = useState(
    filters.singleGenderSchool,
  );
  const [hbcu, setHbcu] = useState(filters.hbcu);
  const [excludeCautionFlags, setExcludeCautionFlags] = useState(
    filters.excludeCautionFlags,
  );
  const [schools, setSchools] = useState(filters.schools);
  const [isRelaffil, setIsRelaffil] = useState(filters.isRelaffil);
  const [employers, setEmployers] = useState(filters.employers);
  const [vettec, setVettec] = useState({
    vettec: filters.vettec,
    preferredProvider: filters.preferredProvider,
  });
  const [type, setType] = useState(filters.type);
  const [country, setCountry] = useState(filters.country);
  const [state, setState] = useState(filters.state);

  const { version } = preview;

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;

  const handleAccordionDropdownOpen = openedName => {
    setOpenName(openedName);
  };

  const handleVetTecChange = checked => {
    setVettec({
      vettec: checked,
      preferredProvider: filters.preferredProvider,
    });
  };

  const handlePreferredProviderChange = checked => {
    setVettec({
      vettec: vettec.vettec || (checked && !vettec.preferredProvider),
      preferredProvider: checked,
    });
  };

  const updateResults = () => {
    const newFilters = {
      accredited,
      excludeCautionFlags,
      country,
      employers,
      hbcu,
      isRelaffil,
      schools,
      singleGenderSchool,
      state,
      studentVeteranGroup,
      type,
      ...vettec,
      yellowRibbonScholarship,
    };

    if (search.tab === TABS.name) {
      dispatchUpdateFiltersAndDoNameSearch(
        search.query.name,
        newFilters,
        version,
      );
    } else {
      dispatchUpdateFiltersAndDoLocationSearch(
        search.query.location,
        search.query.distance,
        newFilters,
        version,
      );
    }
  };

  const renderTypeOfInstitution = () => {
    return (
      <>
        <h3>Type of institution</h3>
        <Checkbox
          checked={schools}
          name="schools"
          label="Schools"
          onChange={e => setSchools(e.target.checked)}
        />
        <Checkbox
          checked={employers}
          name="employers"
          label="Employers (on the job training and apprenticeships)"
          onChange={e => setEmployers(e.target.checked)}
        />
        <Checkbox
          checked={vettec.vettec}
          name="vettec"
          label="VET TEC providers"
          onChange={e => handleVetTecChange(e.target.checked)}
        />
        <div className="vads-u-padding-left--3">
          <Checkbox
            checked={vettec.preferredProvider}
            name="preferredProvider"
            label="Preferred providers"
            onChange={e => handlePreferredProviderChange(e.target.checked)}
          />
        </div>
      </>
    );
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
        onChange={e => setCountry(e.target.value)}
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
        onChange={e => setState(e.target.value)}
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
          checked={excludeCautionFlags}
          name="cautionFlag"
          label={
            <LearnMoreLabel
              text="Has no cautionary warnings"
              onClick={() => dispatchShowModal('cautionaryWarnings')}
              ariaLabel="Learn more about VA education and training programs"
            />
          }
          onChange={e => setExcludeCautionFlags(e.target.checked)}
        />
        <Checkbox
          checked={accredited}
          name="accredited"
          label={
            <LearnMoreLabel
              text="Is accredited"
              onClick={() => dispatchShowModal('accredited')}
              ariaLabel="Learn more about VA education and training programs"
            />
          }
          onChange={e => setAccredited(e.target.checked)}
        />
        <Checkbox
          checked={studentVeteranGroup}
          name="studentVeteranGroup"
          label="Has a Student Veteran Group"
          onChange={e => setStudentVeteranGroup(e.target.checked)}
        />
        <Checkbox
          checked={yellowRibbonScholarship}
          name="yellowRibbonScholarship"
          label="Offers Yellow Ribbon Program"
          onChange={e => setYellowRibbonScholarship(e.target.checked)}
        />
      </>
    );
  };

  const renderTypeOfSchool = () => {
    const options = [
      ...Object.keys(facets.type).map(facetSchoolType => ({
        optionValue: facetSchoolType,
        optionLabel: facetSchoolType,
      })),
    ];

    return (
      <Dropdown
        label="Type of school"
        name="type"
        options={addAllOption(options)}
        value={type}
        alt="Filter results by institution type"
        visible
        onChange={e => setType(e.target.value)}
      />
    );
  };

  const renderSchoolMission = () => {
    return (
      <>
        <p>School mission</p>
        <Checkbox
          checked={hbcu}
          name="hbcu"
          label="Historically Black Colleges and Universities"
          onChange={e => setHbcu(e.target.checked)}
        />
        <Checkbox
          checked={singleGenderSchool}
          name="singleGenderSchool"
          label="Single gender school"
          onChange={e => setSingleGenderSchool(e.target.checked)}
        />
        <Checkbox
          checked={isRelaffil}
          name="isRelaffil"
          label="Religious affiliation"
          onChange={e => setIsRelaffil(e.target.checked)}
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
  filters: state.filters,
  search: state.search,
  preview: state.preview,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchUpdateFiltersAndDoLocationSearch: updateFiltersAndDoLocationSearch,
  dispatchUpdateFiltersAndDoNameSearch: updateFiltersAndDoNameSearch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RefineYourSearch);
