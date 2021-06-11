import React, { useState } from 'react';
import SearchAccordion from '../components/SearchAccordion';
import SearchBenefits from '../components/SearchBenefits';
import RadioButtons from '../components/RadioButtons';
import LearnMoreLabel from '../components/LearnMoreLabel';
import { showModal, updateEligibilityAndFilters } from '../actions';
import { connect } from 'react-redux';

export function TuitionAndHousingEstimates({
  eligibility,
  dispatchUpdateEligibilityAndFilters,
  dispatchShowModal,
}) {
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
  const [onlineClasses, setOnlineClasses] = useState(eligibility.onlineClasses);
  const [expanded, setExpanded] = useState(eligibility.expanded);

  const updateStore = () => {
    dispatchUpdateEligibilityAndFilters({
      militaryStatus,
      spouseActiveDuty,
      giBillChapter,
      cumulativeService,
      enlistmentService,
      eligForPostGiBill,
      numberOfDependents,
      onlineClasses,
    });
  };

  return (
    <div>
      <SearchAccordion
        button="Update tuition and housing estimates"
        buttonLabel="Update results"
        buttonOnClick={updateStore}
        name="benefitEstimates"
        expanded={expanded}
        onClick={value => setExpanded(value)}
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
              onClick={() => dispatchShowModal('onlineOnlyDistanceLearning')}
              ariaLabel="Learn more about how we calculate your housing allowance based on where you take classes"
            />
          }
          name="inPersonClasses"
          options={[
            { value: 'no', label: 'Yes' },
            { value: 'yes', label: 'No' },
          ]}
          value={onlineClasses}
          onChange={e => {
            setOnlineClasses(e.target.value);
          }}
        />
      </SearchAccordion>
    </div>
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
)(TuitionAndHousingEstimates);
