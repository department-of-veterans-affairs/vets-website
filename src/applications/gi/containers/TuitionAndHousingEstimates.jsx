import React, { useState } from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import SearchAccordion from '../components/SearchAccordion';
import SearchBenefits from '../components/SearchBenefits';
import VARadioButton from '../components/VARadioButton';
import LearnMoreLabel from '../components/LearnMoreLabel';
import { showModal, eligibilityChange } from '../actions';
import { createId } from '../utils/helpers';

export function TuitionAndHousingEstimates({
  eligibility,
  dispatchEligibilityChange,
  dispatchShowModal,
  modalClose,
  smallScreen,
}) {
  const { expanded } = eligibility;

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

  const updateStore = () => {
    dispatchEligibilityChange({
      expanded,
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

  const onExpand = value => {
    recordEvent({
      event: value ? 'int-accordion-expand' : 'int-accordion-collapse',
    });
    dispatchEligibilityChange({ expanded: value });
  };

  const closeAndUpdate = () => {
    updateStore();
    modalClose();
  };

  const handlers = {
    onSelection: target => {
      const { value } = target.detail;
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'Will you be taking any classes in person ?',
        'gibct-form-value': value,
      });
      setOnlineClasses(value);
    },
  };

  const controls = (
    <div>
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
      <LearnMoreLabel
        text="Will you be taking any classes in person?"
        dataTestId="in-person-classes-?"
        onClick={() => {
          dispatchShowModal('onlineOnlyDistanceLearning');
        }}
        ariaLabel="Learn more about how we calculate your housing allowance based on where you take classes"
        butttonId="classes-in-person-learn-more"
      />
      <VARadioButton
        radioLabel=""
        name="inPersonClasses"
        initialValue={onlineClasses}
        options={[{ value: 'no', label: 'Yes' }, { value: 'yes', label: 'No' }]}
        onVaValueChange={handlers.onSelection}
      />

      <div id="note" className="vads-u-padding-top--2">
        <b>Note:</b> Changing these settings modifies the tuition and housing
        benefits shown on the search cards.
      </div>
    </div>
  );
  const title = 'Update tuition, housing, and monthly benefit estimates';

  return (
    <div className="vads-u-margin-bottom--2">
      {!smallScreen && (
        <SearchAccordion
          button={title}
          buttonLabel="Update estimates"
          buttonOnClick={updateStore}
          expanded={expanded}
          onClick={onExpand}
          ariaDescribedBy="note"
        >
          {controls}
        </SearchAccordion>
      )}
      {smallScreen && (
        <div className="modal-wrapper">
          <div>
            <h1>Update tuition, housing, and monthly benefit estimates</h1>
            {controls}
          </div>
          <div className="modal-button-wrapper">
            <va-button
              id={`update-${createId(title)}-button`}
              className="update-results-button"
              text="Update estimates"
              onClick={closeAndUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  eligibility: state.eligibility,
  filters: state.filters,
});

const mapDispatchToProps = {
  dispatchShowModal: showModal,
  dispatchEligibilityChange: eligibilityChange,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TuitionAndHousingEstimates);
