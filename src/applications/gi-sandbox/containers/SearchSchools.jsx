import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateEligibilityAndFilters, showModal } from '../actions';
import AccordionDropdown from '../components/AccordionDropdown';
import Checkbox from '../components/Checkbox';
import CheckboxGroup from '../components/CheckboxGroup';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';
import SearchBenefits from '../components/SearchBenefits';
import RadioButtons from '../components/RadioButtons';

export const SearchSchools = ({
  eligibility,
  dispatchUpdateEligibilityAndFilters,
  dispatchShowModal,
  filters,
}) => {
  const [giBillChapter, setGiBillChapter] = useState(eligibility.giBillChapter);
  const [openName, setOpenName] = useState('');
  const [levelOfDegree, setLevelOfDegree] = useState(filters.levelOfDegree);
  const [major, setMajor] = useState(filters.major);
  const [schoolName, setSchoolName] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('10');

  const [militaryStatus, setMilitaryStatus] = useState(
    eligibility.militaryStatus,
  );

  const [spouseActiveDuty, setSpouseActiveDuty] = useState(
    eligibility.spouseActiveDuty,
  );

  const [cumulativeService, setCumulativeService] = useState(
    eligibility.cumulativeService,
  );

  const [enlistmentService, setEnlistmentService] = useState(
    eligibility.enlistmentService,
  );

  const [eligForPostGiBill, setEligForPostGiBill] = useState(
    eligibility.eligForPostGiBill,
  );

  const [numberOfDependents, setNumberOfDependents] = useState(
    eligibility.numberOfDependents,
  );

  const [institutionType, setInstitutionType] = useState(
    filters.institutionType,
  );

  const [levelOfInstitution, setLevelOfInstitution] = useState(
    filters.levelOfInstitution,
  );

  const [inPersonClasses, setInPersonClasses] = useState(
    filters.inPersonClasses,
  );

  const [
    excludeWarningsAndCautionFlags,
    setExcludeWarningsAndCautionFlags,
  ] = useState(filters.excludeWarningsAndCautionFlags);

  const updateStore = () => {
    dispatchUpdateEligibilityAndFilters(
      {
        militaryStatus,
        spouseActiveDuty,
        giBillChapter,
        cumulativeService,
        enlistmentService,
        eligForPostGiBill,
        numberOfDependents,
      },
      {
        institutionType,
        levelOfInstitution,
        excludeWarningsAndCautionFlags,
        levelOfDegree,
        major,
        inPersonClasses,
      },
    );
  };

  const handleLevelOfInstitutionChange = e => {
    setLevelOfInstitution({
      ...levelOfInstitution,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAccordionDropdownOpen = openedName => {
    setOpenName(openedName);
  };

  const doSearch = () => {};

  return (
    <div className="search-controls vads-u-border--2px vads-u-border-color--gray-light vads-u-padding-top--1">
      <div className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-l-row">
        <div className="cells vads-l-col--4">
          <div className="search-section-label">Looking for</div>

          <input
            type="text"
            name="schoolName"
            className="input-box-margin"
            placeholder="name of school"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
          />
        </div>
        <div className="cells vads-l-col--8 vads-u-padding-left--0">
          <div className="vads-u-display--inline-block">
            <div className="search-section-label">Near</div>
            <label className="location-wrap vads-u-margin--0">
              <input
                type="text"
                name="location"
                className="input-box-margin location-input"
                placeholder="city, state, postal code"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </label>
          </div>
          <div className="vads-u-display--inline-block vads-u-padding-left--2p5">
            <div className="search-section-label">Within</div>
            <Dropdown
              name="distance"
              options={[
                { optionValue: '10', optionLabel: '10 miles' },
                { optionValue: '25', optionLabel: '25 miles' },
                { optionValue: '50', optionLabel: '50 miles' },
              ]}
              value={distance}
              alt="distance"
              visible
              onChange={e => setDistance(e.target.value)}
            />
          </div>
          <div className="vads-u-display--inline-block vads-u-padding-left--2p5">
            <button
              type="button"
              id="school-search-button"
              className="calculate-button"
              onClick={doSearch}
            >
              Search
              <i
                style={{ paddingLeft: '16px' }}
                aria-hidden="true"
                className="fa fa-search"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--4 cells">
          <div className="search-section-label">Refine estimates</div>
          <AccordionDropdown
            label="Your Benefit Estimates"
            buttonLabel="Update estimates"
            buttonOnClick={updateStore}
            name="benefitEstimates"
            openName={openName}
            onOpen={handleAccordionDropdownOpen}
            displayCancel
          >
            <SearchBenefits
              cumulativeService={cumulativeService}
              dispatchShowModal={dispatchShowModal}
              eligForPostGiBill={eligForPostGiBill}
              enlistmentService={enlistmentService}
              giBillChapter={giBillChapter}
              militaryStatus={militaryStatus}
              numberOfDependents={numberOfDependents}
              spouseActiveDuty={spouseActiveDuty}
              setCumulativeService={setCumulativeService}
              setEligForPostGiBill={setEligForPostGiBill}
              setEnlistmentService={setEnlistmentService}
              setNumberOfDependents={setNumberOfDependents}
              setGiBillChapter={setGiBillChapter}
              setMilitaryStatus={setMilitaryStatus}
              setSpouseActiveDuty={setSpouseActiveDuty}
            />
            <RadioButtons
              label={
                <LearnMoreLabel
                  text="Will you be taking any classes in person?"
                  onClick={() =>
                    dispatchShowModal('onlineOnlyDistanceLearning')
                  }
                  ariaLabel="Learn more about how we calculate your housing allowance based on where you take classes"
                />
              }
              name="inPersonClasses"
              options={[
                { value: 'no', label: 'Yes' },
                { value: 'yes', label: 'No' },
              ]}
              value={inPersonClasses}
              onChange={e => {
                setInPersonClasses(e.target.value);
              }}
            />
          </AccordionDropdown>
        </div>
        <div className="cells vads-l-col--8 vads-u-border-left--2px vads-u-border-color--gray-light">
          <div className="search-section-label">Refine search</div>

          <div className="vads-u-display--inline-block ">
            <AccordionDropdown
              label="School Preferences"
              buttonLabel="Apply"
              buttonOnClick={updateStore}
              name="schoolPreferences"
              openName={openName}
              onOpen={handleAccordionDropdownOpen}
              displayCancel
            >
              <Dropdown
                label="Institution Type"
                name="institutionType"
                options={[
                  { optionValue: 'ALL', optionLabel: 'All' },
                  { optionValue: 'FLIGHT', optionLabel: 'Flight' },
                  { optionValue: 'FOR_PROFIT', optionLabel: 'For Profit' },
                  { optionValue: 'PRIVATE', optionLabel: 'Private' },
                  { optionValue: 'PUBLIC', optionLabel: 'Public' },
                ]}
                value={institutionType}
                visible
                alt="Institution Type"
                onChange={e => setInstitutionType(e.target.value)}
              />

              <div className="dropdown-divider" />

              <CheckboxGroup
                label="Level of Institution"
                name="levelOfDegree"
                onChange={handleLevelOfInstitutionChange}
                options={[
                  {
                    name: 'fourYear',
                    optionLabel: '4 Year',
                    checked: levelOfInstitution.fourYear,
                  },
                  {
                    name: 'twoYear',
                    optionLabel: '2 Year',
                    checked: levelOfInstitution.twoYear,
                  },
                ]}
              />

              <div className="dropdown-divider" />

              <div>
                <LearnMoreLabel
                  text="Warnings and school closings"
                  onClick={() => dispatchShowModal('cautionaryWarnings')}
                  ariaLabel="Learn more about cautionary Warnings"
                />
                <Checkbox
                  className="exclude-warnings-closings-checkbox"
                  checked={excludeWarningsAndCautionFlags}
                  name="excludeWarningsAndCautionFlags"
                  label="Exclude results with warnings or closings"
                  onChange={e =>
                    setExcludeWarningsAndCautionFlags(e.target.checked)
                  }
                />
              </div>
            </AccordionDropdown>
          </div>

          <div className="vads-u-display--inline-block vads-u-padding-left--2p5">
            <AccordionDropdown
              label="Degrees / Majors"
              buttonLabel="Apply"
              buttonOnClick={updateStore}
              name="degreesMajors"
              openName={openName}
              onOpen={handleAccordionDropdownOpen}
              displayCancel
            >
              <Dropdown
                label="Level of Degree"
                name="institutionType"
                options={[
                  { optionValue: 'ALL', optionLabel: 'All' },
                  { optionValue: 'BACHELORS', optionLabel: "Bachelor's" },
                  { optionValue: 'ASSOCIATE', optionLabel: 'Associate' },
                  { optionValue: 'MASTERS', optionLabel: "Master's" },
                  { optionValue: 'DOCTORAL', optionLabel: 'Doctoral' },
                ]}
                value={levelOfDegree}
                visible
                alt="Level of Degree"
                onChange={e => setLevelOfDegree(e.target.value)}
              />

              <div className="dropdown-divider" />

              <input
                type="text"
                name="major"
                className="input-box-margin"
                placeholder="search a major"
                value={major}
                onChange={e => setMajor(e.target.value)}
              />
            </AccordionDropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  eligibility: state.eligibility,
  filters: state.filters,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchUpdateEligibilityAndFilters: updateEligibilityAndFilters,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchSchools);
