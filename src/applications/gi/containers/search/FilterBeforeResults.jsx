/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import {
  VaLoadingIndicator,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import environment from 'platform/utilities/environment';
import JumpLink from '../../components/profile/JumpLink';
// import LearnMoreLabel from '../../components/LearnMoreLabel';
// import AccordionItem from '../../components/AccordionItem';
import Dropdown from '../../components/Dropdown';
import Loader from '../../components/Loader';
import {
  isProductionOrTestProdEnv,
  getStateNameForCode,
  sortOptionsByStateName,
  addAllOption,
  createId,
  specializedMissionDefinitions,
  sortedSpecializedMissionDefinitions,
  validateSearchTermSubmit,
  isShowVetTec,
  isShowCommunityFocusVACheckbox,
  isEmptyCheckboxFilters,
} from '../../utils/helpers';
import { showModal, filterChange, setError } from '../../actions';
import {
  TABS,
  INSTITUTION_TYPES,
  INSTITUTION_TYPES_DICTIONARY,
  ERROR_MESSAGES,
} from '../../constants';
import CheckboxGroup from '../../components/CheckboxGroup';
import { updateUrlParams } from '../../selectors/search';
import ClearFiltersBtn from '../../components/ClearFiltersBtn';
import VaAccordionGi from '../../components/VaAccordionGi';
import VACheckboxGroupGi from '../../components/VaCheckboxGroupGi';
import AboutYellowRibbonProgram from '../../components/AboutYellowRibbonProgram';
// import { useFilterBtn } from '../../hooks/useFilterbtn';

const etTecOJTOptions = (employers, vettec, automatedTest = false) => {
  if (isShowVetTec(automatedTest)) {
    return [
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
  }
  return [
    {
      name: 'employers',
      dataTestId: 'employers',
      checked: employers,
      optionLabel: 'On-the-job training and apprenticeships',
    },
  ];
};

export function schoolTypesCheckboxes(
  handleIncludedSchoolTypesChange,
  options,
  smallScreen,
  automatedTest = false,
) {
  const schoolTypes = (
    <h3
      className={isProductionOrTestProdEnv() ? 'school-types-label' : ''}
      aria-level={2}
    >
      School types
    </h3>
  );
  if (isShowCommunityFocusVACheckbox(automatedTest)) {
    return (
      <VACheckboxGroupGi
        className="about-school-checkbox"
        label={schoolTypes}
        onChange={handleIncludedSchoolTypesChange}
        options={options}
        row={!smallScreen}
        padding={!smallScreen}
        colNum="1p5"
        labelMargin="3"
        // setIsCleared={setIsCleared}
      />
    );
  }
  return (
    <CheckboxGroup
      className="about-school-checkbox"
      label={schoolTypes}
      onChange={handleIncludedSchoolTypesChange}
      options={options}
      row={!smallScreen}
      colNum="1p5"
      labelMargin="3"
      // setIsCleared={setIsCleared}
    />
  );
}

export function aboutTheSchoolOptions(
  excludeCautionFlags,
  accredited,
  studentVeteran,
  yellowRibbonScholarship,
  automatedTest = false,
) {
  if (isShowCommunityFocusVACheckbox(automatedTest)) {
    return [
      {
        name: 'excludeCautionFlags',
        checked: excludeCautionFlags,
        dataTestId: 'exclude-caution-flags',
        optionLabel: 'Has no cautionary warnings',
      },
      {
        name: 'accredited',
        dataTestId: 'accredited',
        checked: accredited,
        optionLabel: 'Is accredited',
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
  }
  return [
    {
      name: 'excludeCautionFlags',
      checked: excludeCautionFlags,
      dataTestId: 'exclude-caution-flags',
      optionLabel: (
        <label
          className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block"
          htmlFor="excludeCautionFlags"
        >
          Has no cautionary warnings
        </label>
      ),
    },
    {
      name: 'accredited',
      dataTestId: 'accredited',
      checked: accredited,
      optionLabel: (
        <label
          className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block"
          htmlFor="accredited"
        >
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
}

export function aboutTheSchool(
  onChangeCheckbox,
  options,
  smallScreen,
  automatedTest = false,
) {
  const aboutTheSchoolLabel = (
    <>
      <h3 className="about-school-label" aria-level={2}>
        About the school
      </h3>
      <AboutYellowRibbonProgram className="vads-u-margin-bottom--3" />
    </>
  );
  if (isShowCommunityFocusVACheckbox(automatedTest)) {
    return (
      <>
        <VACheckboxGroupGi
          // setIsCleared={setIsCleared}
          className="about-school-checkbox"
          label={aboutTheSchoolLabel}
          onChange={onChangeCheckbox}
          options={options}
          row={!smallScreen}
          padding={!smallScreen}
          colNum="1p5"
        />
      </>
    );
  }
  return (
    <CheckboxGroup
      // setIsCleared={setIsCleared}
      className={isProductionOrTestProdEnv() ? 'about-school-checkbox' : ''}
      label={aboutTheSchoolLabel}
      onChange={onChangeCheckbox}
      options={options}
      row={!smallScreen}
      padding={!smallScreen}
      colNum="4p5"
    />
  );
}

export function otherCheckboxes(
  handleVetTechPreferredProviderChange,
  options,
  smallScreen,
  automatedTest = false,
) {
  const otherLabel = (
    <h3 className="about-school-label" aria-level={2}>
      Other
    </h3>
  );
  if (isShowCommunityFocusVACheckbox(automatedTest)) {
    return (
      <VACheckboxGroupGi
        className="other-checkbox"
        label={otherLabel}
        onChange={handleVetTechPreferredProviderChange}
        options={options}
        // setIsCleared={setIsCleared}
        row={!smallScreen}
        colNum="4p5"
      />
    );
  }
  return (
    <CheckboxGroup
      className={isProductionOrTestProdEnv() ? 'other-checkbox' : ''}
      label={otherLabel}
      onChange={handleVetTechPreferredProviderChange}
      options={options}
      // setIsCleared={setIsCleared}
      row={!smallScreen}
      colNum="4p5"
    />
  );
}

export function communityFocusCheckboxes(
  onChangeCheckbox,
  sortedOptions,
  smallScreen,
  automatedTest = false,
) {
  if (isShowCommunityFocusVACheckbox(automatedTest)) {
    return (
      <VACheckboxGroupGi
        class="vads-u-margin-y--4"
        className="my-filters-margin"
        onChange={onChangeCheckbox}
        options={sortedOptions}
        // setIsCleared={setIsCleared}
        row={!smallScreen}
        colNum="4"
      />
    );
  }
  return (
    <CheckboxGroup
      class="vads-u-margin-y--4"
      className="my-filters-margin"
      onChange={onChangeCheckbox}
      options={sortedOptions}
      // setIsCleared={setIsCleared}
      row={!smallScreen}
      colNum="4"
    />
  );
}

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
  onApplyFilterClick,
}) {
  const history = useHistory();
  const { version } = preview;
  const { error } = errorReducer;
  // const { isCleared, setIsCleared, loading } = useFilterBtn();
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

  useEffect(
    () => {
      const isEmpty = isEmptyCheckboxFilters(filters);

      if (error === ERROR_MESSAGES.checkBoxFilterEmpty && !isEmpty)
        dispatchError(null);
    },
    [
      schools,
      excludeCautionFlags,
      accredited,
      studentVeteran,
      yellowRibbonScholarship,
      employers,
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
    ],
  );

  const facets =
    search.tab === TABS.name ? search.name.facets : search.location.facets;

  const [smfAccordionExpanded, setSmfAccordionExpanded] = useState(false);
  const [jumpLinkToggle, setJumpLinkToggle] = useState(0);

  const smfDefinitions = sortedSpecializedMissionDefinitions().map(smf => {
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

  const recordCheckboxHomeEvent = e => {
    recordEvent({
      event: 'gibct-home-form-change',
      'gibct-home-form-field': e.target.name,
      'gibct-home-form-value': e.target.checked,
    });
  };
  const handleVetTechPreferredProviderChange = (e, currentName) => {
    const { checked } = e.target;
    const name = currentName || e.target.name;
    if (checked && name === 'vettec') {
      dispatchFilterChange({
        ...filters,
        vettec: true,
        preferredProvider: true,
      });
      recordCheckboxEvent(e);
      recordCheckboxHomeEvent(e);
    }
    if (!checked && name === 'vettec') {
      dispatchFilterChange({
        ...filters,
        vettec: false,
        preferredProvider: false,
      });
      recordCheckboxEvent(e);
      recordCheckboxHomeEvent(e);
    }

    if (checked && name === 'employers') {
      dispatchFilterChange({
        ...filters,
        employers: true,
      });
      recordCheckboxEvent(e);
      recordCheckboxHomeEvent(e);
    }

    if (!checked && name === 'employers') {
      dispatchFilterChange({
        ...filters,
        employers: false,
      });
      recordCheckboxEvent(e);
      recordCheckboxHomeEvent(e);
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

  const onChangeCheckbox = (e, currentName) => {
    const name = currentName || e.target.name;
    recordCheckboxEvent(e);
    recordCheckboxHomeEvent(e);
    updateInstitutionFilters(name, e.target.checked);
  };

  const handleIncludedSchoolTypesChange = (e, currentName) => {
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
    // const { name } = e.target;
    const name = currentName || e.target.name;
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
        optionLabel: INSTITUTION_TYPES_DICTIONARY[type],
        dataTestId: `school-type-${type}`,
      };
    });

    return (
      <div className="filter-your-results">
        {schoolTypesCheckboxes(
          handleIncludedSchoolTypesChange,
          options,
          smallScreen,
        )}
      </div>
    );
  };

  const schoolAttributes = () => {
    const options = aboutTheSchoolOptions(
      excludeCautionFlags,
      accredited,
      studentVeteran,
      yellowRibbonScholarship,
    );

    return aboutTheSchool(onChangeCheckbox, options, smallScreen);
  };

  const vetTecOJT = () => {
    const options = etTecOJTOptions(employers, vettec);
    return otherCheckboxes(
      handleVetTechPreferredProviderChange,
      options,
      smallScreen,
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
      employers: true,
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
      validateSearchTermSubmit(
        nameVal,
        dispatchError,
        error,
        filters,
        searchType,
      )
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
    onApplyFilterClick();
  };

  const specializedMissionAttributes = () => {
    const options = [
      {
        name: 'specialMissionHbcu',
        dataTestId: 'special-mission-hbcu',
        checked: specialMissionHbcu,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Historically Black Colleges and Universities'
          : 'Historically Black college or university',
      },
      {
        name: 'specialMissionMenonly',
        dataTestId: 'special-mission-menonly',
        checked: specialMissionMenonly,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Men’s colleges and universities'
          : 'Men-only',
      },
      {
        name: 'specialMissionWomenonly',
        dataTestId: 'special-mission-womenonly',
        checked: specialMissionWomenonly,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Women’s colleges and universities'
          : 'Women-only',
        // optionLabel: 'Women-only',
      },
      {
        name: 'specialMissionRelaffil',
        dataTestId: 'special-mission-relaffil',
        checked: specialMissionRelaffil,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Religiously-affiliated institutions'
          : 'Religious affiliation',
      },
      {
        name: 'specialMissionHSI',
        dataTestId: 'special-mission-hsi',
        checked: specialMissionHSI,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Hispanic-Serving Institutions'
          : 'Hispanic-serving institutions',
      },
      {
        name: 'specialMissionNANTI',
        dataTestId: 'special-mission-nanti',
        checked: specialMissionNANTI,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Native American-Serving Nontribal Institutions'
          : 'Native American-serving institutions',
      },
      {
        name: 'specialMissionANNHI',
        dataTestId: 'special-mission-annhi',
        checked: specialMissionANNHI,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Alaska Native-Serving Institutions'
          : 'Alaska Native-serving institutions',
      },
      {
        name: 'specialMissionAANAPII',
        dataTestId: 'special-mission-aanapii',
        checked: specialMissionAANAPII,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Asian American and Native American Pacific Islander-Serving Institutions'
          : 'Asian American Native American Pacific Islander-serving institutions',
      },
      {
        name: 'specialMissionPBI',
        dataTestId: 'special-mission-pbi',
        checked: specialMissionPBI,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Predominantly Black Institutions'
          : 'Predominantly Black institutions',
      },
      {
        name: 'specialMissionTRIBAL',
        dataTestId: 'special-mission-tribal',
        checked: specialMissionTRIBAL,
        optionLabel: isProductionOrTestProdEnv()
          ? 'Tribal Colleges and Universities'
          : 'Tribal college and university',
      },
    ];

    const sortedOptions = options.sort((a, b) =>
      a.optionLabel.localeCompare(b.optionLabel),
    );

    return (
      <div className="community-focus-container">
        <h3
          className={isProductionOrTestProdEnv() ? 'school-types-label' : ''}
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
                isProductionOrTestProdEnv()
                  ? 'mobile-jump-link labels-margin'
                  : 'mobile-jump-link'
              }
            />
          )}
          {communityFocusCheckboxes(
            onChangeCheckbox,
            sortedOptions,
            smallScreen,
          )}
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
            <VaButton
              id={`update-${createId(title)}-button`}
              className="apply-filter-button vads-u-margin-top--3"
              onClick={closeAndUpdate}
              data-testid="update-filter-your-results-button"
              text="Apply filters"
            />
            <ClearFiltersBtn
              className="vads-u-margin-left--2"
              onClick={onApplyFilterClick}
            />
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
      {/* {loading && <Loader className="search-loader" />} */}
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
FilterBeforeResults.propTypes = {
  dispatchError: PropTypes.func,
  dispatchFilterChange: PropTypes.func,
  errorReducer: PropTypes.object,
  filters: PropTypes.object,
  modalClose: PropTypes.func,
  nameVal: PropTypes.string,
  preview: PropTypes.object,
  search: PropTypes.object,
  searchType: PropTypes.string,
  onApplyFilterClick: PropTypes.func,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterBeforeResults);
