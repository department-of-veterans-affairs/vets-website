import React from 'react';
import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsListV2';

function ViewDependentsLists(props) {
  const onAwardSubhead = (
    <>
      These dependents are on your VA benefits. If you’ve recently made changes,
      they might not be reflected here yet.
    </>
  );

  const notOnAwardSubhead = (
    <>
      These dependents may not be eligible to be on your VA benefits. If you’ve
      recently made changes, they might not be reflected here yet.
    </>
  );

  return (
    <div>
      <ViewDependentsList
        loading={props.loading}
        header="Dependents on your VA benefits"
        subHeader={onAwardSubhead}
        dependents={props.onAwardDependents}
        isAward
        manageDependentsToggle={props.manageDependentsToggle}
      />
      <ViewDependentsList
        loading={props.loading}
        header="Dependents not on your VA benefits"
        subHeader={notOnAwardSubhead}
        dependents={props.notOnAwardDependents}
      />
    </div>
  );
}

export default ViewDependentsLists;
