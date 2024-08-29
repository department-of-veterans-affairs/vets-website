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

import {
  isProductionOrTestProdEnv,
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
  createId,
  validateSearchTerm,
  isShowVetTec,
} from '../utils/helpers';
import { showModal, filterChange, setError, focusSearch } from '../actions';
import {
  TABS,
  INSTITUTION_TYPES,
  INSTITUTION_TYPES_DICTIONARY,
} from '../constants';
import CheckboxGroup from '../components/CheckboxGroup';
import { updateUrlParams } from '../selectors/search';
import ClearFiltersBtn from '../components/ClearFiltersBtn';
// import { useFilterBtn } from '../hooks/useFilterbtn';
// import Loader from '../components/Loader';

const vetTecCheckbox = (
  vettec,
  preferredProvider,
  handleVetTecChange,
  handlePreferredProviderChange,
  legendId,
  automatedTest = false,
) => {
  if (isShowVetTec(automatedTest)) {
    return (
      <>
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
  }
  return <div />;
};

export function FilterYourResults({
  dispatchFilterChange,
  dispatchError,
  filters,
  modalClose,
  preview,
  search,
  smallScreen,
  errorReducer,
  searchType,
  dispatchFocusSearch,
}) {
  const history = useHistory();
  const { version } = preview;
  const { error } = errorReducer;
  const {
    expanded,
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
  const [nameValue, setNameValue] = useState(
    search.query.name || search.query.location,
  );
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
    if (isProductionOrTestProdEnv()) {
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
        optionLabel: INSTITUTION_TYPES_DICTIONARY[type],
      };
    });

    return (
      <CheckboxGroup
        label={<h3>School types</h3>}
        onChange={handleIncludedSchoolTypesChange}
        options={options}
        // setIsCleared={setIsCleared}
      />
    );
  };

  const schoolAttributes = () => {
    const options = [
      {
        name: 'excludeCautionFlags',
        checked: excludeCautionFlags,
        optionLabel: (
          <label className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block">
            Has no cautionary warnings
          </label>
        ),
      },
      {
        name: 'accredited',
        checked: accredited,
        optionLabel: (
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
        label={<h3>About the school</h3>}
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
        optionLabel: 'Historically Black Colleges and Universities',
      },
      {
        name: 'specialMissionMenonly',
        checked: specialMissionMenonly,
        optionLabel: 'Men’s colleges and universities',
      },
      {
        name: 'specialMissionWomenonly',
        checked: specialMissionWomenonly,
        optionLabel: 'Women’s colleges and universities',
        // optionLabel: 'Women-only',
      },
      {
        name: 'specialMissionRelaffil',
        checked: specialMissionRelaffil,
        optionLabel: 'Religiously-affiliated institutions',
      },
      {
        name: 'specialMissionHSI',
        checked: specialMissionHSI,
        optionLabel: 'Hispanic-Serving Institutions',
      },
      {
        name: 'specialMissionNANTI',
        checked: specialMissionNANTI,
        optionLabel: 'Native American-Serving Nontribal Institutions',
      },
      {
        name: 'specialMissionANNHI',
        checked: specialMissionANNHI,
        optionLabel: 'Alaska Native-Serving Institutions',
      },
      {
        name: 'specialMissionAANAPII',
        checked: specialMissionAANAPII,
        optionLabel:
          'Asian American and Native American Pacific Islander-Serving Institutions',
      },
      {
        name: 'specialMissionPBI',
        checked: specialMissionPBI,
        optionLabel: 'Predominantly Black Institutions',
      },
      {
        name: 'specialMissionTRIBAL',
        checked: specialMissionTRIBAL,
        optionLabel: 'Tribal Colleges and Universities',
      },
    ];

    const sortedOptions = options.sort((a, b) =>
      a.optionLabel.localeCompare(b.optionLabel),
    );

    return (
      <CheckboxGroup
        class="vads-u-margin-y--4"
        label={<h3>Community focus</h3>}
        onChange={onChangeCheckbox}
        options={sortedOptions}
      />
    );
  };

  const typeOfInstitution = () => {
    const legendId = `${createId(name)}-legend`;
    return (
      <div className="vads-u-margin-bottom--4">
        {excludedSchoolTypesGroup()}
        {schoolAttributes()}
        <h3>Other</h3>
        <Checkbox
          checked={employers}
          name="employers"
          label="On-the-job training and apprenticeships"
          onChange={onChangeCheckbox}
          className="vads-u-margin-bottom--4"
          inputAriaLabelledBy={legendId}
        />
        {vetTecCheckbox(
          vettec,
          preferredProvider,
          handleVetTecChange,
          handlePreferredProviderChange,
          legendId,
        )}
        {specializedMissionAttributes()}
      </div>
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
        {/* {loading && <Loader className="search-loader" />} */}
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
          dispatchFocusSearch={dispatchFocusSearch}
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
              <ClearFiltersBtn
                smallScreen={smallScreen}
                // isCleared={isCleared}
                // setIsCleared={setIsCleared}
              >
                Reset search
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
  dispatchFocusSearch: focusSearch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterYourResults);
