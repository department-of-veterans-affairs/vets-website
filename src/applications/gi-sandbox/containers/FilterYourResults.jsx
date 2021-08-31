import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchAccordion from '../components/SearchAccordion';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import {
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
} from '../utils/helpers';
import { showModal, filterChange } from '../actions';
import { connect } from 'react-redux';
import { TABS, INSTITUTION_TYPES } from '../constants';
import CheckboxGroup from '../components/CheckboxGroup';
import _ from 'lodash';
import { updateUrlParams } from '../selectors/search';

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
    excludedSchoolTypes,
    excludeCautionFlags,
    accredited,
    studentVeteran,
    yellowRibbonScholarship,
    specialMission,
    employers,
    vettec,
    preferredProvider,
    country,
    state,
  } = filters;

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;

  const [showAllSchoolTypes, setShowAllSchoolTypes] = useState(false);

  const updateInstitutionFilters = (name, value) => {
    dispatchFilterChange({ ...filters, [name]: value });
  };
  const onChangeCheckbox = e =>
    updateInstitutionFilters(e.target.name, e.target.checked);

  const onChange = e => updateInstitutionFilters(e.target.name, e.target.value);

  const onAccordionChange = value => {
    updateInstitutionFilters('expanded', value);
  };

  const handleSchoolChange = e => {
    const checked = e.target.checked;

    if (!checked) {
      dispatchFilterChange({
        ...filters,
        schools: false,
        excludedSchoolTypes: [],
        excludeCautionFlags: false,
        accredited: false,
        studentVeteran: false,
        yellowRibbonScholarship: false,
        specialMission: 'ALL',
      });
    } else {
      onChangeCheckbox(e);
    }
  };

  const handleExcludedSchoolTypesChange = e => {
    const name = e.target.name;
    const checked = e.target.checked;
    const newExcluded = _.cloneDeep(excludedSchoolTypes);
    updateInstitutionFilters(
      'excludedSchoolTypes',
      checked
        ? newExcluded.concat(name)
        : newExcluded.filter(type => type !== name),
    );
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

  const excludedSchoolTypesGroup = () => {
    const options = (showAllSchoolTypes
      ? INSTITUTION_TYPES
      : INSTITUTION_TYPES.slice(0, 4)
    ).map(type => {
      return {
        name: type.toUpperCase(),
        checked: excludedSchoolTypes.includes(type.toUpperCase()),
        optionLabel: type,
      };
    });

    return (
      <div className="vads-u-margin-bottom--5">
        <CheckboxGroup
          label={
            <div className="vads-u-margin-left--neg0p25">
              Exclude these school types:
            </div>
          }
          onChange={handleExcludedSchoolTypesChange}
          options={options}
        />
        {!showAllSchoolTypes && (
          <button
            className="va-button-link see-more-less"
            onClick={() => setShowAllSchoolTypes(true)}
          >
            See more...
          </button>
        )}
        {showAllSchoolTypes && (
          <button
            className="va-button-link see-more-less"
            onClick={() => setShowAllSchoolTypes(false)}
          >
            See less...
          </button>
        )}
      </div>
    );
  };

  const schoolAttributes = () => {
    return (
      <>
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

  const specialMissions = () => {
    const options = [
      {
        optionValue: 'hbcu',
        optionLabel: 'Historically Black College or University',
      },
      {
        optionValue: 'menonly',
        optionLabel: 'Men-only',
      },
      {
        optionValue: 'womenonly',
        optionLabel: 'Women-only',
      },
      {
        optionValue: 'relaffil',
        optionLabel: 'Religious Affiliation',
      },
    ];
    return (
      <Dropdown
        onChange={onChange}
        value={specialMission}
        name="specialMission"
        options={addAllOption(options)}
        alt="Specialized mission (i.e., Single-gender, Religious affiliation, HBCU)"
        label="Specialized mission (i.e., Single-gender, Religious affiliation, HBCU)"
        visible
      />
    );
  };

  const typeOfInstitution = () => {
    return (
      <>
        <div className="vads-u-margin-bottom--4">
          <h3 className="vads-u-margin-bottom--3">Type of institution</h3>
          <ExpandingGroup open={schools}>
            <Checkbox
              checked={schools}
              name="schools"
              label="Schools"
              onChange={handleSchoolChange}
              className="expanding-header-checkbox"
            />
            <div className="school-types expanding-group-children">
              {excludedSchoolTypesGroup()}
              {schoolAttributes()}
              {specialMissions()}
            </div>
          </ExpandingGroup>
        </div>
        <Checkbox
          checked={employers}
          name="employers"
          label="On-the-job training and apprenticeships"
          onChange={onChangeCheckbox}
          className="vads-u-margin-bottom--4"
        />
        <ExpandingGroup open={vettec}>
          <Checkbox
            checked={vettec}
            name="vettec"
            label="VET TEC providers"
            onChange={handleVetTecChange}
            className="expanding-header-checkbox"
          />
          <div className="expanding-group-children">
            <Checkbox
              checked={preferredProvider}
              name="preferredProvider"
              label="Preferred providers"
              onChange={handlePreferredProviderChange}
            />
          </div>
        </ExpandingGroup>
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

  const controls = (
    <div>
      {typeOfInstitution()}
      {renderLocation()}
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
          {search.inProgress && <LoadingIndicator />}
          {!search.inProgress && controls}
        </SearchAccordion>
      )}
      {smallScreen && (
        <div className="modal-wrapper">
          <div>
            <h1>Filter your results</h1>
            {search.inProgress && <LoadingIndicator />}
            {!search.inProgress && controls}
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
