import React, { useState } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import LearnMoreLabel from './LearnMoreLabel';
import Dropdown from './Dropdown';
import {
  POST_911_ARRAY,
  FRY_SCHOLARSHIP_ARRAY,
  MONTGOMERY_GI_BILL_ARRAY,
  SELECT_RESERVE_GI_BILL_ARRAY,
  VETERAN_READINESS_ARRAY,
  SURVIVOR_AND_DEPENDENT_ARRAY,
} from '../constants';

const SearchBenefits = ({
  cumulativeService,
  dispatchShowModal,
  eligForPostGiBill,
  enlistmentService,
  giBillChapter,
  militaryStatus,
  numberOfDependents,
  spouseActiveDuty,
  setCumulativeService,
  setEligForPostGiBill,
  setEnlistmentService,
  setNumberOfDependents,
  setGiBillChapter,
  setMilitaryStatus,
  setSpouseActiveDuty,
}) => {
  const [
    whatsYourMilitaryStatusDropDown,
    setWhatsYourMilitaryStatusDropDown,
  ] = useState(POST_911_ARRAY);
  const chapter33Check = giBillChapter === '33a' || giBillChapter === '33b';
  const [isDisabled, setIsDisabled] = useState(true);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggle = useToggleValue(TOGGLE_NAMES.militaryBenefitEstimates);
  const toggleValue = toggle || window.isProd;
  /*
    ***toggleCumulativeDropDown***
    Hide Cumulative Post 9/11 active-duty service drop down if applicant selects 'Fry Scholarship'
    as their GI Bill Benefit
  */
  const toggleCumulativeDropDown = () => giBillChapter !== '33b';
  const handleChange = e => {
    const field = e.target.name;
    const { value } = e.target;

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': `What's your military status?`,
      'gibct-form-value': e.target.value,
    });
    setMilitaryStatus(e.target.value);

    if (field === 'militaryStatus' && !toggleValue) {
      setIsDisabled(true);
      if (value === 'spouse' || value === 'child') {
        setIsDisabled(false);
      }
      setGiBillChapter('33a');
    }
  };

  const preEligibilityChange = e => {
    const { value } = e.target;

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'Which GI Bill benefit do you want to use?',
      'gibct-form-value': e.target.value,
    });
    setGiBillChapter(value);

    if (toggleValue) {
      if (value === '33a') {
        setWhatsYourMilitaryStatusDropDown(POST_911_ARRAY);
        setMilitaryStatus('veteran');
      } else if (value === '33b') {
        setWhatsYourMilitaryStatusDropDown(FRY_SCHOLARSHIP_ARRAY);
        setMilitaryStatus('spouse');
      } else if (value === '30') {
        setWhatsYourMilitaryStatusDropDown(MONTGOMERY_GI_BILL_ARRAY);
        setMilitaryStatus('veteran');
      } else if (value === '1606') {
        setWhatsYourMilitaryStatusDropDown(SELECT_RESERVE_GI_BILL_ARRAY);
        setMilitaryStatus('national guard / reserves');
      } else if (value === '31') {
        setWhatsYourMilitaryStatusDropDown(VETERAN_READINESS_ARRAY);
        setMilitaryStatus('veteran');
      } else if (value === '35') {
        setWhatsYourMilitaryStatusDropDown(SURVIVOR_AND_DEPENDENT_ARRAY);
        setMilitaryStatus('spouse');
      }
    }
  };

  return (
    <div>
      {!toggleValue && (
        <div>
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
            onChange={handleChange}
          />

          <Dropdown
            label="Is your spouse currently on active duty?"
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
        </div>
      )}
      <Dropdown
        label={
          <LearnMoreLabel
            text="Which GI Bill benefit do you want to use?"
            onClick={() => {
              dispatchShowModal('giBillChapter');
            }}
            ariaLabel="Learn more about VA education and training programs"
          />
        }
        name="giBillChapter"
        options={[
          { optionValue: '33a', optionLabel: 'Post-9/11 GI Bill (Ch 33)' },
          { optionValue: '33b', optionLabel: 'Fry Scholarship (Ch 33)' },
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
            optionLabel: 'Veteran Readiness and Employment (VR&E) (Ch 31)',
          },
          {
            optionValue: '35',
            optionLabel:
              "Survivors' and Dependents' Educational Assistance (DEA) (Ch 35)",
            optionDisabled: toggleValue ? false : isDisabled,
          },
        ]}
        value={giBillChapter}
        alt="Which GI Bill benefit do you want to use?"
        visible
        onChange={e => preEligibilityChange(e)}
      />
      {toggleValue && (
        <>
          <Dropdown
            label="What's your military status?"
            name="militaryStatus"
            options={whatsYourMilitaryStatusDropDown}
            value={militaryStatus}
            alt="What's your military status?"
            visible
            onChange={handleChange}
          />

          <Dropdown
            label="Is your spouse currently on active duty?"
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
        </>
      )}
      {militaryStatus === 'active duty' &&
        chapter33Check && (
          <div className="military-status-info warning form-group">
            <va-icon icon="warning" />
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
            service member on active duty) are not eligible to receive a monthly
            housing allowance.
          </div>
        )}

      {giBillChapter === '31' && (
        <div
          className="military-status-info info form-group"
          data-testid="to-apply-for-VR&E"
        >
          <va-icon icon="info" />
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
            onClick={() => {
              dispatchShowModal('cumulativeService');
            }}
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
        visible={chapter33Check && toggleCumulativeDropDown()}
        onChange={e => {
          recordEvent({
            event: 'gibct-form-change',
            'gibct-form-field': 'Cumulative Post-9/11 active-duty service',
            'gibct-form-value': e.target.value,
          });
          setCumulativeService(e.target.value);
        }}
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
          { optionValue: '3', optionLabel: '3+ years of enlistment' },
          { optionValue: '2', optionLabel: '2 years of enlistment' },
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
    </div>
  );
};

SearchBenefits.propTypes = {
  cumulativeService: PropTypes.string,
  dispatchShowModal: PropTypes.func,
  eligForPostGiBill: PropTypes.string,
  enlistmentService: PropTypes.string,
  giBillChapter: PropTypes.string,
  militaryStatus: PropTypes.string,
  numberOfDependents: PropTypes.string,
  setCumulativeService: PropTypes.func,
  setEligForPostGiBill: PropTypes.func,
  setEnlistmentService: PropTypes.func,
  setGiBillChapter: PropTypes.func,
  setMilitaryStatus: PropTypes.func,
  setNumberOfDependents: PropTypes.func,
  setSpouseActiveDuty: PropTypes.func,
  spouseActiveDuty: PropTypes.string,
};
export default SearchBenefits;
