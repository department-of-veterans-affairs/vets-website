import React, { useState } from 'react';
import SearchResultCard from './SearchResultCard';
import SearchBenefits from './SearchBenefits';
import TuitionHousingEstimateAccordionDropdown from './TuitionHousingEstimateAccordionDropdown';
import LearnMoreLabel from './LearnMoreLabel';
import RadioButtons from './RadioButtons';
import { connect } from 'react-redux';
import { updateEligibilityAndFilters, showModal } from '../actions';

export function SearchResults({
  search,
  eligibility,
  dispatchUpdateEligibilityAndFilters,
  dispatchShowModal,
  filters,
}) {
  const [giBillChapter, setGiBillChapter] = useState(eligibility.giBillChapter);
  const [openName, setOpenName] = useState('');

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

  const [inPersonClasses, setInPersonClasses] = useState(
    filters.inPersonClasses,
  );

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
        inPersonClasses,
      },
    );
  };

  const handleAccordionDropdownOpen = openedName => {
    setOpenName(openedName);
  };

  return (
    <>
      {search.count > 0 && (
        <div className="usa-grid vads-u-padding--1">
          <p>
            Showing <strong>{search.count} search results</strong> for '
            <strong>{search.query.name}</strong>'
          </p>
          <div className="usa-width-one-third">
            <div>
              <TuitionHousingEstimateAccordionDropdown
                button="Update tuition and housing estimates"
                buttonLabel="Update results"
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
              </TuitionHousingEstimateAccordionDropdown>
            </div>
          </div>
          <div className="usa-width-two-thirds vads-u-margin-right--neg2">
            <div className="vads-l-row vads-u-flex-wrap--wrap">
              {search.results.map(institution => (
                <SearchResultCard
                  institution={institution}
                  key={institution.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
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
)(SearchResults);
