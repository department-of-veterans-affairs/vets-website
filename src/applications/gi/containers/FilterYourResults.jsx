import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';
import SearchAccordion from '../components/SearchAccordion';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';
import {
  isProductionOfTestProdEnv,
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
  createId,
  validateSearchTerm,
} from '../utils/helpers';
import { showModal, filterChange, setError } from '../actions';
import { TABS, INSTITUTION_TYPES } from '../constants';
import CheckboxGroup from '../components/CheckboxGroup';
import { updateUrlParams } from '../selectors/search';
import ClearFiltersBtn from '../components/ClearFiltersBtn';

export function FilterYourResults({
  dispatchShowModal,
  dispatchFilterChange,
  dispatchError,
  filters,
  modalClose,
  preview,
  search,
  smallScreen,
  errorReducer,
  searchType,
}) {
  const history = useHistory();
  const { version } = preview;
  const { error } = errorReducer;
  const {
    expanded,
    schools,
    excludedSchoolTypes,
    excludeCautionFlags,
    accredited,
    studentVeteran,
    yellowRibbonScholarship,
    employers,
    vettec,
    preferredProvider,
    country,
    state,
    specialMissionHbcu,
    specialMissionMenonly,
    specialMissionWomenonly,
    specialMissionRelaffil,
    specialMissionHSI,
    specialMissionNANTI,
    specialMissionANNHI,
    specialMissionAANAPII,
    specialMissionPBI,
    specialMissionTRIBAL,
  } = filters;

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;
  const [nameValue, setNameValue] = useState(search.query.name);

  const recordCheckboxEvent = e => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.checked,
    });
  };

  const updateInstitutionFilters = (name, value) => {
    dispatchFilterChange({ ...filters, [name]: value });
  };
  const onChangeCheckbox = e => {
    recordCheckboxEvent(e);
    updateInstitutionFilters(e.target.name, e.target.checked);
  };

  const onChange = e => {
    setNameValue(e.target.value);
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.value,
    });
    updateInstitutionFilters(e.target.name, e.target.value);
  };

  const onAccordionChange = value => {
    recordEvent({
      event: value ? 'int-accordion-expand' : 'int-accordion-collapse',
    });
    updateInstitutionFilters('expanded', value);
  };

  const handleSchoolChange = e => {
    const { checked } = e.target;

    if (!checked) {
      dispatchFilterChange({
        ...filters,
        schools: false,
        excludedSchoolTypes: [
          'PUBLIC',
          'FOR PROFIT',
          'PRIVATE',
          'FOREIGN',
          'FLIGHT',
          'CORRESPONDENCE',
          'HIGH SCHOOL',
        ],
        excludeCautionFlags: false,
        accredited: false,
        studentVeteran: false,
        yellowRibbonScholarship: false,
        specialMission: 'ALL',
      });
      recordCheckboxEvent(e);
    } else {
      onChangeCheckbox(e);
    }
  };

  const handleIncludedSchoolTypesChange = e => {
    // The filter consumes these as exclusions
    const { name } = e.target;
    const { checked } = e.target;
    const newExcluded = _.cloneDeep(excludedSchoolTypes);
    recordCheckboxEvent(e);
    updateInstitutionFilters(
      'excludedSchoolTypes',
      checked
        ? newExcluded.concat(name)
        : newExcluded.filter(type => type !== name),
    );
  };

  const handleVetTecChange = e => {
    const { checked } = e.target;
    if (!checked) {
      dispatchFilterChange({
        ...filters,
        vettec: false,
        preferredProvider: false,
      });
      recordCheckboxEvent(e);
    } else {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: false,
      });
      recordCheckboxEvent(e);
    }
  };

  const handlePreferredProviderChange = e => {
    const { checked } = e.target;
    if (checked) {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: true,
      });
      recordCheckboxEvent(e);
    } else {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: false,
      });
      recordCheckboxEvent(e);
    }
  };

  const updateResults = () => {
    if (!isProductionOfTestProdEnv()) {
      validateSearchTerm(nameValue, dispatchError, error, filters, searchType);
    }
    updateInstitutionFilters('search', true);

    updateUrlParams(history, search.tab, search.query, filters, version);
  };

  const closeAndUpdate = () => {
    updateResults();
    modalClose();
  };

  const excludedSchoolTypesGroup = () => {
    const options = INSTITUTION_TYPES.map(type => {
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
              Include these school types:
            </div>
          }
          onChange={handleIncludedSchoolTypesChange}
          options={options}
        />
      </div>
    );
  };

  const schoolAttributes = () => {
    const options = [
      {
        name: 'excludeCautionFlags',
        checked: excludeCautionFlags,
        optionLabel: isProductionOfTestProdEnv() ? (
          <LearnMoreLabel
            text="Has no cautionary warnings"
            onClick={() => {
              dispatchShowModal('cautionaryWarnings');
            }}
            ariaLabel="Learn more about VA education and training programs"
          />
        ) : (
          <label className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block">
            Has no cautionary warnings
          </label>
        ),
      },
      {
        name: 'accredited',
        checked: accredited,
        optionLabel: isProductionOfTestProdEnv() ? (
          <LearnMoreLabel
            text="Is accredited"
            onClick={() => {
              dispatchShowModal('accredited');
            }}
            buttonId="accredited-button"
            ariaLabel="Learn more about VA education and training programs"
          />
        ) : (
          <label className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block">
            Is accredited
          </label>
        ),
      },
      {
        name: 'studentVeteran',
        checked: studentVeteran,
        optionLabel: 'Has a Student Veteran Group',
      },
      {
        name: 'yellowRibbonScholarship',
        checked: yellowRibbonScholarship,
        optionLabel: 'Offers Yellow Ribbon Program',
      },
    ];

    return (
      <CheckboxGroup
        label={
          <div className="vads-u-margin-left--neg0p25">About the school:</div>
        }
        onChange={onChangeCheckbox}
        options={options}
      />
    );
  };

  const specializedMissionAttributes = () => {
    const options = [
      {
        name: 'specialMissionHbcu',
        checked: specialMissionHbcu,
        optionLabel: !isProductionOfTestProdEnv()
          ? 'Historically Black college or university'
          : 'Historically Black Colleges and Universities',
      },
      {
        name: 'specialMissionMenonly',
        checked: specialMissionMenonly,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Men-only'
          : 'Men’s colleges and universities',
      },
      {
        name: 'specialMissionWomenonly',
        checked: specialMissionWomenonly,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Women-only'
          : 'Women’s colleges and universities',
        // optionLabel: 'Women-only',
      },
      {
        name: 'specialMissionRelaffil',
        checked: specialMissionRelaffil,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Religious affiliation'
          : 'Religiously affiliated institutions',
      },
      {
        name: 'specialMissionHSI',
        checked: specialMissionHSI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Hispanic-serving institutions'
          : 'Hispanic-Serving Institutions',
      },
      {
        name: 'specialMissionNANTI',
        checked: specialMissionNANTI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Native American-serving institutions'
          : 'Native American-Serving Nontribal Institutions',
      },
      {
        name: 'specialMissionANNHI',
        checked: specialMissionANNHI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Alaska Native-serving institutions'
          : 'Alaska Native-Serving Institutions',
      },
      {
        name: 'specialMissionAANAPII',
        checked: specialMissionAANAPII,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Asian American Native American Pacific Islander-serving institutions'
          : 'Asian American and Native American Pacific Islander-Serving Institutions',
      },
      {
        name: 'specialMissionPBI',
        checked: specialMissionPBI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Predominantly Black institutions'
          : 'Predominantly Black Institutions',
      },
      {
        name: 'specialMissionTRIBAL',
        checked: specialMissionTRIBAL,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Tribal college and university'
          : 'Tribal Colleges and Universities',
      },
    ];

    return (
      <CheckboxGroup
        class="vads-u-margin-y--4"
        label={
          <div className="vads-u-margin-left--neg0p25">
            {`${
              environment.isProduction()
                ? 'Specialized mission'
                : 'Community focus'
            } (i.e., Single-gender, Religious affiliation, HBCU)`}
          </div>
        }
        onChange={onChangeCheckbox}
        options={options}
      />
    );
  };

  const typeOfInstitution = () => {
    const name = 'Type of institution';
    const legendId = `${createId(name)}-legend`;
    return (
      <>
        <div className="vads-u-margin-bottom--4">
          <h3
            className="vads-u-margin-bottom--3"
            aria-label={`${name}:`}
            id={legendId}
          >
            {name}
          </h3>
          <div className="vads-u-margin-bottom--4">
            {specializedMissionAttributes()}
          </div>
          <Checkbox
            checked={schools}
            name="schools"
            label="Schools"
            onChange={handleSchoolChange}
            className="expanding-header-checkbox"
            inputAriaLabelledBy={legendId}
          />
          <div className="school-types expanding-group-children">
            {schools && (
              <>
                {excludedSchoolTypesGroup()}
                {schoolAttributes()}
              </>
            )}
          </div>
        </div>
        <Checkbox
          checked={employers}
          name="employers"
          label="On-the-job training and apprenticeships"
          onChange={onChangeCheckbox}
          className="vads-u-margin-bottom--4"
          inputAriaLabelledBy={legendId}
        />
        <Checkbox
          checked={vettec}
          name="vettec"
          label="VET TEC providers"
          onChange={handleVetTecChange}
          className="expanding-header-checkbox"
          inputAriaLabelledBy={legendId}
        />
        <div className="expanding-group-children">
          {vettec && (
            <Checkbox
              checked={preferredProvider}
              name="preferredProvider"
              label="Preferred providers only"
              onChange={handlePreferredProviderChange}
              labelAriaLabel="VET TEC Preferred providers"
              inputAriaLabelledBy={legendId}
            />
          )}
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

  const controls = (
    <div>
      {typeOfInstitution()}
      {renderLocation()}
    </div>
  );

  const title = 'Filter your results';

  return (
    <div className="filter-your-results vads-u-margin-bottom--2">
      {!smallScreen && (
        <SearchAccordion
          button={title}
          buttonLabel="Update results"
          buttonOnClick={() => updateResults()}
          expanded={expanded}
          onClick={onAccordionChange}
        >
          {search.inProgress && (
            <VaLoadingIndicator
              data-testid="loading-indicator"
              message="Loading..."
            />
          )}
          {!search.inProgress && controls}
        </SearchAccordion>
      )}
      {smallScreen && (
        <div className="modal-wrapper">
          <div>
            <h1>Filter your results</h1>
            {search.inProgress && (
              <VaLoadingIndicator
                data-testid="loading-indicator"
                message="Loading..."
              />
            )}
            {!search.inProgress && controls}
          </div>
          <div className="modal-button-wrapper">
            <button
              type="button"
              id={`update-${createId(title)}-button`}
              className="update-results-button"
              onClick={closeAndUpdate}
            >
              Update results
            </button>
            {!environment.isProduction() && (
              <ClearFiltersBtn smallScreen={smallScreen}>
                Clear filters
              </ClearFiltersBtn>
            )}
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
  errorReducer: state.errorReducer,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchFilterChange: filterChange,
  dispatchError: setError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterYourResults);
