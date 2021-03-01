import React from 'react';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import Dropdown from './Dropdown';
import LearnMoreLabel from './LearnMoreLabel';

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
  return (
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
            service member on active duty) are not eligible to receive a monthly
            housing allowance.
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
    </div>
  );
};

export default SearchBenefits;
