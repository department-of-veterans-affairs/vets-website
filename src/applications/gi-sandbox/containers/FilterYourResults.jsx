import React from 'react';
import { useHistory } from 'react-router-dom';
import SearchAccordion from '../components/SearchAccordion';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';

import {
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
  updateUrlParams,
} from '../utils/helpers';
import { showModal, filterChange } from '../actions';
import { connect } from 'react-redux';
import { TABS } from '../constants';
import CheckboxGroup from '../components/CheckboxGroup';

export function FilterYourResults({
  dispatchShowModal,
  dispatchFilterChange,
  filters,
  modalClose,
  preview,
  search,
  smallScreen,
}) {
  const history = useHistory();
  const { version } = preview;
  const {
    expanded,
    schools,
    accredited,
    studentVeteran,
    yellowRibbonScholarship,
    singleGenderSchool,
    hbcu,
    excludeCautionFlags,
    relaffil,
    country,
    state,
    vettec,
    preferredProvider,
    employers,
  } = filters;

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;

  const updateInstitutionFilters = (name, value) => {
    dispatchFilterChange({ ...filters, [name]: value });
  };
  const onChangeCheckbox = e =>
    updateInstitutionFilters(e.target.name, e.target.checked);

  const onChange = e => updateInstitutionFilters(e.target.name, e.target.value);

  const onAccordionChange = value => {
    updateInstitutionFilters('expanded', value);
  };

  const handleVetTecChange = e => {
    const checked = e.target.checked;
    if (!checked) {
      dispatchFilterChange({
        ...filters,
        vettec: false,
        preferredProvider: false,
      });
    } else {
      onChangeCheckbox(e);
    }
  };

  const handlePreferredProviderChange = e => {
    const checked = e.target.checked;
    if (checked) {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: true,
      });
    } else {
      onChangeCheckbox(e);
    }
  };

  const updateResults = () => {
    updateInstitutionFilters('search', true);

    updateUrlParams(history, search.tab, search.query, filters, version);
  };

  const closeAndUpdate = () => {
    updateResults();
    modalClose();
  };

  const excludeSchoolTypes = () => {
    const options = Object.keys(facets.type).map(key => {
      return {
        name: key,
        checked: false,
        optionLabel: key,
      };
    });
    return (
      <CheckboxGroup
        label={'Exclude these school types:'}
        onChange={onChangeCheckbox}
        options={options}
      />
    );
  };

  const renderTypeOfInstitution = () => {
    return (
      <>
        <h3>Type of institution</h3>
        <ExpandingGroup open={schools}>
          <Checkbox
            checked={schools}
            name="schools"
            label="Schools"
            onChange={onChangeCheckbox}
          />
          <div className="school-types vads-u-padding-left--4">
            {excludeSchoolTypes()}
          </div>
        </ExpandingGroup>
        <Checkbox
          checked={employers}
          name="employers"
          label="Employers (on the job training and apprenticeships)"
          onChange={onChangeCheckbox}
        />
        <Checkbox
          checked={vettec}
          name="vettec"
          label="VET TEC providers"
          onChange={handleVetTecChange}
        />
        <div className="vads-u-padding-left--3">
          <Checkbox
            checked={preferredProvider}
            name="preferredProvider"
            label="Preferred providers"
            onChange={handlePreferredProviderChange}
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

  const renderSchoolAttributes = () => {
    return (
      <>
        <h3>School attributes</h3>
        <p>About the school</p>
        <Checkbox
          checked={excludeCautionFlags}
          name="excludeCautionFlags"
          label={
            <LearnMoreLabel
              text="Has no cautionary warnings"
              onClick={() => dispatchShowModal('cautionaryWarnings')}
              ariaLabel="Learn more about VA education and training programs"
            />
          }
          onChange={onChangeCheckbox}
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
          onChange={onChangeCheckbox}
        />
        <Checkbox
          checked={studentVeteran}
          name="studentVeteran"
          label="Has a Student Veteran Group"
          onChange={onChangeCheckbox}
        />
        <Checkbox
          checked={yellowRibbonScholarship}
          name="yellowRibbonScholarship"
          label="Offers Yellow Ribbon Program"
          onChange={onChangeCheckbox}
        />
      </>
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
          onChange={onChangeCheckbox}
        />
        <Checkbox
          checked={singleGenderSchool}
          name="singleGenderSchool"
          label="Single gender school"
          onChange={onChangeCheckbox}
        />
        <Checkbox
          checked={relaffil}
          name="relaffil"
          label="Religious affiliation"
          onChange={onChangeCheckbox}
        />
      </>
    );
  };

  const controls = (
    <div>
      {renderTypeOfInstitution()}
      {renderLocation()}
      {renderSchoolAttributes()}
      {renderSchoolMission()}
    </div>
  );

  return (
    <div className="filter-your-results vads-u-margin-bottom--2">
      {!smallScreen && (
        <SearchAccordion
          button="Filter your results"
          buttonLabel="Update results"
          buttonOnClick={() => updateResults()}
          name="benefitEstimates"
          expanded={expanded}
          onClick={onAccordionChange}
        >
          {controls}
        </SearchAccordion>
      )}
      {smallScreen && (
        <div className="modal-wrapper">
          <div>
            <h1>Filter your results</h1>
            {controls}
          </div>
          <div className="modal-button-wrapper">
            <button
              type="button"
              id="update-benefits-button"
              className="update-results-button"
              onClick={closeAndUpdate}
            >
              Update results
            </button>
          </div>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterYourResults);
