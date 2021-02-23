import React, { useState } from 'react';
import { connect } from 'react-redux';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import {
  eligibilityChange,
  institutionFilterChange,
  showModal,
} from '../actions';
import AccordionDropdown from '../components/AccordionDropdown';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import LearnMoreLabel from '../components/LearnMoreLabel';
import CheckboxGroup from '../components/CheckboxGroup';

export const SearchSchools = ({
  eligibility,
  dispatchEligibilityChange,
  dispatchInstitutionFilterChange,
  dispatchShowModal,
  filters,
}) => {
  const [giBillChapter, setGiBillChapter] = useState(eligibility.giBillChapter);

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

  const [
    excludeWarningsAndCautionFlags,
    setExcludeWarningsAndCautionFlags,
  ] = useState(filters.excludeWarningsAndCautionFlags);

  const updateEligibility = () => {
    dispatchEligibilityChange({
      militaryStatus,
      spouseActiveDuty,
      giBillChapter,
      cumulativeService,
      enlistmentService,
      eligForPostGiBill,
      numberOfDependents,
    });
  };

  const updateFilters = () => {
    dispatchInstitutionFilterChange({
      institutionType,
      levelOfInstitution,
      excludeWarningsAndCautionFlags,
    });
  };

  const handleLevelOfInstitutionChange = e => {
    setLevelOfInstitution({
      ...levelOfInstitution,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div>
      <div className="vads-u-display--flex">
        <div className="vads-u-flex--1">Looking For</div>
        <div className="vads-u-flex--1">Near</div>
        <div className="vads-u-flex--1">
          <div>Within</div>
          <div>Search</div>
        </div>
      </div>
      <div className="vads-u-display--flex">
        <div className="vads-u-flex--1">
          <div>Refine estimates</div>
          <AccordionDropdown
            label="Your Benefit Estimates"
            buttonLabel="Update estimates"
            buttonOnClick={updateEligibility}
            displayCancel
          >
            <Dropdown
              label="What's your military status?"
              name="militaryStatus"
              options={[
                { optionValue: 'veteran', optionLabel: 'Veteran' },
                { optionValue: 'active duty', optionLabel: 'Active Duty' },
                {
                  optionValue: 'national guard / reserves',
                  optionLabel: 'National Guard / Reserves',
                },
                { optionValue: 'spouse', optionLabel: 'Spouse' },
                { optionValue: 'child', optionLabel: 'Child' },
              ]}
              value={militaryStatus}
              alt="What's your military status?"
              visible
              onChange={e => setMilitaryStatus(e.target.value)}
            />

            <Dropdown
              label="Is your spouse on active duty?"
              name="spouseActiveDuty"
              options={[
                { optionValue: 'yes', optionLabel: 'Yes' },
                { optionValue: 'no', optionLabel: 'No' },
              ]}
              value={spouseActiveDuty}
              alt="Is your spouse on active duty?"
              visible={militaryStatus === 'spouse'}
              onChange={e => setSpouseActiveDuty(e.target.value)}
            />

            <Dropdown
              label={
                <LearnMoreLabel
                  text="Which GI Bill benefit do you want to use?"
                  onClick={() => dispatchShowModal('giBillChapter')}
                  ariaLabel="Learn more about VA education and training programs"
                />
              }
              name="giBillChapter"
              options={[
                { optionValue: '33', optionLabel: 'Post-9/11 GI Bill (Ch 33)' },
                {
                  optionValue: '30',
                  optionLabel: 'Montgomery GI Bill (Ch 30)',
                },
                {
                  optionValue: '1606',
                  optionLabel: 'Select Reserve GI Bill (Ch 1606)',
                },
                {
                  optionValue: '31',
                  optionLabel: 'Veteran Readiness and Employment',
                },
                {
                  optionValue: '35',
                  optionLabel: 'Dependents Educational Assistance (DEA)',
                },
              ]}
              value={giBillChapter}
              alt="Which GI Bill benefit do you want to use?"
              visible
              onChange={e => setGiBillChapter(e.target.value)}
            />

            {militaryStatus === 'active duty' &&
              giBillChapter === '33' && (
                <div className="military-status-info warning form-group">
                  <i className="fa fa-warning" />
                  <a
                    title="Post 9/11 GI Bill"
                    href="http://www.benefits.va.gov/gibill/post911_gibill.asp"
                    id="anch_378"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Post 9/11 GI Bill
                  </a>{' '}
                  recipients serving on Active Duty (or transferee spouses of a
                  service member on active duty) are not eligible to receive a
                  monthly housing allowance.
                </div>
              )}

            {giBillChapter === '31' && (
              <div className="military-status-info info form-group">
                <i className="fa fa-info-circle" />
                To apply for VR&E benefits, please{' '}
                <EbenefitsLink path="ebenefits/about/feature?feature=vocational-rehabilitation-and-employment">
                  visit this site
                </EbenefitsLink>
                .
              </div>
            )}

            <Dropdown
              label={
                <LearnMoreLabel
                  text="Cumulative Post-9/11 active-duty service"
                  onClick={() => dispatchShowModal('cumulativeService')}
                  ariaLabel="Learn more about Cumulative Post-9/11 service"
                />
              }
              name="cumulativeService"
              options={[
                { optionValue: '1.0', optionLabel: '36+ months: 100%' }, // notice not 1.00
                { optionValue: '0.9', optionLabel: '30 months: 90%' },
                { optionValue: '0.8', optionLabel: '24 months: 80%' },
                { optionValue: '0.7', optionLabel: '18 months: 70%' },
                { optionValue: '0.6', optionLabel: '6 months: 60%' },
                { optionValue: '0.5', optionLabel: '90 days: 50%' },
                {
                  optionValue: '1.00',
                  optionLabel: 'GYSGT Fry Scholarship: 100%',
                }, // notice not 1.0
                {
                  optionValue: 'service discharge',
                  optionLabel: 'Service-Connected Discharge: 100%',
                },
                {
                  optionValue: 'purple heart',
                  optionLabel: 'Purple Heart Service: 100%',
                },
              ]}
              value={cumulativeService}
              alt="Cumulative Post-9/11 active-duty service"
              visible={giBillChapter === '33'}
              onChange={e => setCumulativeService(e.target.value)}
            />
            <Dropdown
              label={
                <LearnMoreLabel
                  text="Completed an enlistment of:"
                  onClick={() => dispatchShowModal('enlistmentService')}
                  ariaLabel="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"
                />
              }
              name="enlistmentService"
              options={[
                { optionValue: '3', optionLabel: '3 or more years' },
                { optionValue: '2', optionLabel: '2 or more years' },
              ]}
              value={enlistmentService}
              alt="Completed an enlistment of:"
              visible={giBillChapter === '30'}
              onChange={e => setEnlistmentService(e.target.value)}
            />

            <Dropdown
              label="Are you eligible for the Post-9/11 GI Bill?"
              name="eligForPostGiBill"
              options={[
                { optionValue: 'yes', optionLabel: 'Yes' },
                { optionValue: 'no', optionLabel: 'No' },
              ]}
              value={eligForPostGiBill}
              alt="Are you eligible for the Post-9/11 GI Bill?"
              visible={giBillChapter === '31'}
              onChange={e => setEligForPostGiBill(e.target.value)}
            />

            <Dropdown
              label="How many dependents do you have?"
              name="numberOfDependents"
              options={[
                { optionValue: '0', optionLabel: '0 Dependents' },
                { optionValue: '1', optionLabel: '1 Dependent' },
                { optionValue: '2', optionLabel: '2 Dependents' },
                { optionValue: '3', optionLabel: '3 Dependents' },
                { optionValue: '4', optionLabel: '4 Dependents' },
                { optionValue: '5', optionLabel: '5 Dependents' },
              ]}
              value={numberOfDependents}
              alt="How many dependents do you have?"
              visible={giBillChapter === '31' && eligForPostGiBill === 'no'}
              onChange={e => setNumberOfDependents(e.target.value)}
            />
          </AccordionDropdown>
        </div>
        <div className="vads-u-flex--2">
          <div>Refine search</div>

          <AccordionDropdown
            label="School preferences"
            buttonLabel="Apply"
            buttonOnClick={updateFilters}
            displayCancel
          >
            <Dropdown
              label="Institution Type"
              name="institutionType"
              options={[
                { optionValue: 'ALL', optionLabel: 'ALL' },
                { optionValue: 'FLIGHT', optionLabel: 'FLIGHT' },
                { optionValue: 'FOR_PROFIT', optionLabel: 'FOR PROFIT' },
                { optionValue: 'PRIVATE', optionLabel: 'PRIVATE' },
                { optionValue: 'PUBLIC', optionLabel: 'PUBLIC' },
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
              <p>
                <LearnMoreLabel
                  text="Warnings and school closings"
                  onClick={() => dispatchShowModal('cautionaryWarnings')}
                  ariaLabel="Learn more about cautionary Warnings"
                />
              </p>
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
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  eligibility: state.eligibility,
  filters: state.filters,
});

const mapDispatchToProps = {
  dispatchEligibilityChange: eligibilityChange,
  dispatchInstitutionFilterChange: institutionFilterChange,
  dispatchShowModal: showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchSchools);
