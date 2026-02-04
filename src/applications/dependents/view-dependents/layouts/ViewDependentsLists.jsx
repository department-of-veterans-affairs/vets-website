import React from 'react';
import PropTypes from 'prop-types';

import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsList';

/**
 * @typedef {Object} ViewDependentsListsProps
 * @property {Array} onAwardDependents - list of dependents on award
 * @property {Array} notOnAwardDependents - list of dependents not on award
 * @property {boolean} loading - whether data is loading
 * @property {boolean} manageDependentsToggle - whether manage dependents
 * feature is enabled
 *
 * @param {ViewDependentsListsProps} props - component props
 * @returns {JSX.Element} - ViewDependentsLists component
 */
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

ViewDependentsLists.propTypes = {
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  notOnAwardDependents: PropTypes.array,
  onAwardDependents: PropTypes.array,
};

export default ViewDependentsLists;
