/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import environment from 'platform/utilities/environment';
import JumpLink from '../../components/profile/JumpLink';
// import LearnMoreLabel from '../../components/LearnMoreLabel';
// import AccordionItem from '../../components/AccordionItem';
import Dropdown from '../../components/Dropdown';
import {
  isProductionOfTestProdEnv,
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
  createId,
  specializedMissionDefinitions,
  validateSearchTerm,
} from '../../utils/helpers';
import { showModal, filterChange, setError } from '../../actions';
import { TABS, INSTITUTION_TYPES } from '../../constants';
import CheckboxGroup from '../../components/CheckboxGroup';
import { updateUrlParams } from '../../selectors/search';
import ClearFiltersBtn from '../../components/ClearFiltersBtn';
import VaAccordionGi from '../../components/VaAccordionGi';

export function FilterBeforeResults({
  dispatchFilterChange,
  dispatchError,
  filters,
  modalClose,
  preview,
  search,
  smallScreen,
  errorReducer,
  nameVal,
  searchType,
}) {
  const history = useHistory();
  const { version } = preview;
  const { error } = errorReducer;
  const {
    schools,
    excludedSchoolTypes,
    excludeCautionFlags,
    accredited,
    studentVeteran,
    yellowRibbonScholarship,
    employers,
    vettec,
    preferredProvider, // data never read however, it is being modified
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

  const [smfAccordionExpanded, setSmfAccordionExpanded] = useState(false);
  const [jumpLinkToggle, setJumpLinkToggle] = useState(0);

  const smfDefinitions = specializedMissionDefinitions.map(smf => {
    return (
      <div key={smf.key}>
        <h3>{smf.title}</h3>
        <p>{smf.definition}</p>
      </div>
    );
  });
  const jumpLinkClick = () => {
    // only update jumpLinkToggle if in mobile view
    if (smallScreen) {
      setJumpLinkToggle(jumpLinkToggle + 1);
    }
    setSmfAccordionExpanded(true);
  };
  // Scroll effect does not work on mobile view due
  // to the way state updates, because of this,
  // I am using useEffect for the scroll to only
  // when jumpLinkToggle updates
  useEffect(
    () => {
      const scrollToSMFAccordion = () => {
        const targetEl = document.getElementById('smfAccordion');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      return jumpLinkToggle > 0 && smallScreen && scrollToSMFAccordion();
    },
    [jumpLinkToggle],
  );

  const recordCheckboxEvent = e => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.checked,
    });
  };

  const handleVetTechPreferredProviderChange = e => {
    const { checked, name } = e.target;
    if (checked && name === 'vettec') {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: true,
      });
      recordCheckboxEvent(e);
    }
    if (!checked && name === 'vettec') {
      dispatchFilterChange({
        ...filters,
        vettec: false,
        preferredProvider: false,
      });
      recordCheckboxEvent(e);
    }

    if (checked && name === 'employers') {
      dispatchFilterChange({
        ...filters,
        employers: true,
      });
      recordCheckboxEvent(e);
    }

    if (!checked && name === 'employers') {
      dispatchFilterChange({
        ...filters,
        employers: false,
      });
      recordCheckboxEvent(e);
    }
  };

  const updateInstitutionFilters = (
    name,
    value,
    updateSchoolsFilter = false,
  ) => {
    if (updateSchoolsFilter) {
      dispatchFilterChange({ ...filters, [name]: value, schools: true });
    } else if (value.length === 0) {
      dispatchFilterChange({ ...filters, [name]: value, schools: false });
    } else {
      dispatchFilterChange({ ...filters, [name]: value });
    }
  };

  const onChangeCheckbox = e => {
    recordCheckboxEvent(e);
    updateInstitutionFilters(e.target.name, e.target.checked);
  };

  const handleIncludedSchoolTypesChange = e => {
    // The filter consumes these as exclusions
    /* 
      if schools boolean is false, no matter what school type filter
      is selected, no school results will be returned.
      Must have schools boolean true in order for the 
      school types filters to work.

      this code checks to see if schools is false and
      makes it true if any of the school types filters
      are checked.
    */
    const { name } = e.target;
    const { checked } = e.target;
    const newExcluded = _.cloneDeep(excludedSchoolTypes);
    recordCheckboxEvent(e);
    updateInstitutionFilters(
      'excludedSchoolTypes',
      checked
        ? newExcluded.concat(name)
        : newExcluded.filter(type => type !== name),
      !schools,
    );
  };

  const excludedSchoolTypesGroup = () => {
    // Used as the individual options for School Types
    const options = INSTITUTION_TYPES.map(type => {
      return {
        name: type.toUpperCase(),
        checked: excludedSchoolTypes.includes(type.toUpperCase()),
        optionLabel: type,
        dataTestId: `school-type-${type}`,
      };
    });

    return (
      <div className="filter-your-results">
        <CheckboxGroup
          className="about-school-checkbox"
          label={
            <h3
              className={
                isProductionOfTestProdEnv() ? '' : 'school-types-label'
              }
              aria-level={2}
            >
              School types
            </h3>
          }
          onChange={handleIncludedSchoolTypesChange}
          options={options}
          row={!smallScreen}
          colNum="1p5"
          labelMargin="3"
        />
      </div>
    );
  };

  const schoolAttributes = () => {
    const options = [
      {
        name: 'excludeCautionFlags',
        checked: excludeCautionFlags,
        dataTestId: 'exclude-caution-flags',
        optionLabel: (
          <label className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block">
            Has no cautionary warnings
          </label>
        ),
      },
      {
        name: 'accredited',
        dataTestId: 'accredited',
        checked: accredited,
        optionLabel: (
          <label className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block">
            Is accredited
          </label>
        ),
      },
      {
        name: 'studentVeteran',
        dataTestId: 'student-veteran',
        checked: studentVeteran,
        optionLabel: 'Has a Student Veteran Group',
      },
      {
        name: 'yellowRibbonScholarship',
        dataTestId: 'yellow-ribbon',
        checked: yellowRibbonScholarship,
        optionLabel: 'Offers Yellow Ribbon Program',
      },
    ];

    return (
      <CheckboxGroup
        className={isProductionOfTestProdEnv() ? '' : 'about-school-checkbox'}
        label={
          <h3
            className={isProductionOfTestProdEnv() ? '' : 'about-school-label'}
            aria-level={2}
          >
            About the school
          </h3>
        }
        onChange={onChangeCheckbox}
        options={options}
        row={!smallScreen}
        colNum="4p5"
      />
    );
  };
  const vetTecOJT = () => {
    const options = [
      {
        name: 'employers',
        dataTestId: 'employers',
        checked: employers,
        optionLabel: 'On-the-job training and apprenticeships',
      },
      {
        name: 'vettec',
        dataTestId: 'vettec',
        checked: vettec,
        optionLabel: 'VET TEC providers',
      },
    ];
    return (
      <CheckboxGroup
        className={isProductionOfTestProdEnv() ? '' : 'other-checkbox'}
        label={
          <h3
            className={isProductionOfTestProdEnv() ? '' : 'about-school-label'}
            aria-level={2}
          >
            Other
          </h3>
        }
        onChange={handleVetTechPreferredProviderChange}
        options={options}
        row={!smallScreen}
        colNum="4p5"
      />
    );
  };

  const clearAllFilters = () => {
    dispatchFilterChange({
      ...filters,
      schools: false,
      excludedSchoolTypes: [],
      excludeCautionFlags: false,
      accredited: false,
      studentVeteran: false,
      yellowRibbonScholarship: false,
      employers: false,
      vettec: false,
      preferredProvider: false,
      country: 'ALL',
      state: 'ALL',
      specialMissionHbcu: false,
      specialMissionMenonly: false,
      specialMissionWomenonly: false,
      specialMissionRelaffil: false,
      specialMissionHSI: false,
      specialMissionNANTI: false,
      specialMissionANNHI: false,
      specialMissionAANAPII: false,
      specialMissionPBI: false,
      specialMissionTRIBAL: false,
    });
  };

  const onChange = e => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.value,
    });
    updateInstitutionFilters(e.target.name, e.target.value);
  };

  const updateResults = () => {
    updateInstitutionFilters('search', true);

    updateUrlParams(history, search.tab, search.query, filters, version);
  };

  const closeAndUpdate = () => {
    if (
      validateSearchTerm(nameVal, dispatchError, error, filters, searchType)
    ) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'nameSearch',
        'gibct-form-value': nameVal,
      });
    }
    updateResults();
    if (modalClose) {
      modalClose();
    }
  };

  const specializedMissionAttributes = () => {
    const options = [
      {
        name: 'specialMissionHbcu',
        dataTestId: 'special-mission-hbcu',
        checked: specialMissionHbcu,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Historically Black college or university'
          : 'Historically Black Colleges and Universities',
      },
      {
        name: 'specialMissionMenonly',
        dataTestId: 'special-mission-menonly',
        checked: specialMissionMenonly,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Men-only'
          : 'Men’s colleges and universities',
      },
      {
        name: 'specialMissionWomenonly',
        dataTestId: 'special-mission-womenonly',
        checked: specialMissionWomenonly,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Women-only'
          : 'Women’s colleges and universities',
        // optionLabel: 'Women-only',
      },
      {
        name: 'specialMissionRelaffil',
        dataTestId: 'special-mission-relaffil',
        checked: specialMissionRelaffil,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Religious affiliation'
          : 'Religiously affiliated institutions',
      },
      {
        name: 'specialMissionHSI',
        dataTestId: 'special-mission-hsi',
        checked: specialMissionHSI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Hispanic-serving institutions'
          : 'Hispanic-Serving Institutions',
      },
      {
        name: 'specialMissionNANTI',
        dataTestId: 'special-mission-nanti',
        checked: specialMissionNANTI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Native American-serving institutions'
          : 'Native American-Serving Nontribal Institutions',
      },
      {
        name: 'specialMissionANNHI',
        dataTestId: 'special-mission-annhi',
        checked: specialMissionANNHI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Alaska Native-serving institutions'
          : 'Alaska Native-Serving Institutions',
      },
      {
        name: 'specialMissionAANAPII',
        dataTestId: 'special-mission-aanapii',
        checked: specialMissionAANAPII,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Asian American Native American Pacific Islander-serving institutions'
          : 'Asian American and Native American Pacific Islander-Serving Institutions',
      },
      {
        name: 'specialMissionPBI',
        dataTestId: 'special-mission-pbi',
        checked: specialMissionPBI,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Predominantly Black institutions'
          : 'Predominantly Black Institutions',
      },
      {
        name: 'specialMissionTRIBAL',
        dataTestId: 'special-mission-tribal',
        checked: specialMissionTRIBAL,
        optionLabel: isProductionOfTestProdEnv()
          ? 'Tribal college and university'
          : 'Tribal Colleges and Universities',
      },
    ];

    return (
      <div className="community-focus-container">
        <h3
          className={isProductionOfTestProdEnv() ? '' : 'school-types-label'}
          aria-level={2}
        >
          Community focus
        </h3>
        <div style={{ marginTop: '-10px' }}>
          {smallScreen && <>Go to community focus details</>}
          {!smallScreen && (
            <JumpLink
              label="Go to community focus details"
              jumpToId="learn-more-about-specialized-missions-accordion-button"
              dataTestId="go-to-comm-focus-details"
              iconToggle={false}
              onClick={() => jumpLinkClick()}
              customClass="filter-before-res-jump-link"
              className={
                isProductionOfTestProdEnv()
                  ? 'mobile-jump-link'
                  : 'mobile-jump-link labels-margin'
              }
            />
          )}
          <CheckboxGroup
            class="vads-u-margin-y--4"
            className={isProductionOfTestProdEnv() ? '' : 'my-filters-margin'}
            label={
              <h3 className="visually-hidden" aria-level={2}>
                Community focus
              </h3>
            }
            onChange={onChangeCheckbox}
            options={options}
            row={!smallScreen}
            colNum="4"
          />
        </div>
      </div>
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

  const renderLocation = () => {
    return (
      <>
        <h3>Location</h3>
        {renderCountryFilter()}
        {renderStateFilter()}
      </>
    );
  };

  const typeOfInstitution = () => {
    const title = 'Filter your results';
    return (
      <>
        <hr />
        <div className="horizontal-line" />
        <fieldset className="gi-mission-filter-fieldset">
          <legend>
            <h2>{title}</h2>
          </legend>
          {excludedSchoolTypesGroup()}
          {schoolAttributes()}
          {vetTecOJT()}
          <hr />
          <div className="horizontal-line" />
          {specializedMissionAttributes()}
          {smallScreen && renderLocation()}
          <div className="modal-button-wrapper">
            <button
              type="button"
              id={`update-${createId(title)}-button`}
              className="update-results-button apply-filter-button vads-u-margin-top--3"
              onClick={closeAndUpdate}
            >
              Apply filters
            </button>
            {isProductionOfTestProdEnv() ? (
              <button
                onClick={clearAllFilters}
                className={
                  smallScreen
                    ? 'clear-filters-button mobile-clear-filter-button'
                    : 'clear-filters-button'
                }
              >
                Clear filters
              </button>
            ) : (
              <ClearFiltersBtn testId="clear-button">
                Clear filters
              </ClearFiltersBtn>
            )}
          </div>
          <div
            id="learn-more-about-specialized-missions-accordion-button"
            className="vads-u-margin-top--3"
          >
            <VaAccordionGi
              onChange={() => {
                setSmfAccordionExpanded(!smfAccordionExpanded);
              }}
              expanded={smfAccordionExpanded}
              title="Learn more about community focus filters"
            >
              <div>{smfDefinitions}</div>
            </VaAccordionGi>
          </div>
        </fieldset>
      </>
    );
  };

  /*
  when loading page, check to see if school filter is false
    if false check to see if excludedSchoolTypes does not equal empty array
    if true set school filter to true
    On rare occasions school filter loads as false which can 
    result in no search results based off the false school filter
  */
  useEffect(() => {
    return () => {
      if (!schools && excludedSchoolTypes.length > 0) {
        dispatchFilterChange({ ...filters, schools: true });
      }
    };
  }, []);

  const controls = <div>{typeOfInstitution()}</div>;

  return (
    <div className="filter-your-results vads-u-margin-bottom--2">
      {!smallScreen && (
        <div>
          {search.inProgress && (
            <VaLoadingIndicator
              data-testid="loading-indicator"
              message="Loading..."
            />
          )}
          {!search.inProgress && controls}
        </div>
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
)(FilterBeforeResults);
