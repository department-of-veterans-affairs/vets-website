import React from 'react';
import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsList';

function ViewDependentsLists(props) {
  const onAwardSubhead = (
    <>
      The following dependents have been added to your VA benefits. Please let
      us know if a dependent’s status has changed.
    </>
  );

  const notOnAwardSubhead = (
    <>
      The following dependents aren’t on your VA benefits. This is because
      either their dependent status is still awaiting a decision or their status
      has changed and they’re no longer eligible to be on your benefit award.
      Please let us know if a dependent’s status has changed.
    </>
  );

  return (
    <div>
      <ViewDependentsList
        loading={props.loading}
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        link="/disability/add-remove-dependent/"
        linkText="Learn more about adding or removing a dependent from your VA benefits."
        dependents={props.onAwardDependents}
        isAward
        manageDependentsToggle={props.manageDependentsToggle}
      />
      <ViewDependentsList
        loading={props.loading}
        header="Dependents not on your VA benefits"
        subHeader={notOnAwardSubhead}
        link="/disability/add-remove-dependent/"
        linkText="Learn more about adding or removing a dependent from your VA benefits."
        dependents={props.notOnAwardDependents}
      />
    </div>
  );
}

export default ViewDependentsLists;
