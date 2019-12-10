import React, { Component } from 'react';
import ViewDependentsListItem from './ViewDependentsListItem';

class ViewDependentsList extends Component {
  render() {
    return (
      <>
        <h3>Dependents on award</h3>
        <p className="vads-u-padding-bottom--2">
          Dependents on award have been added to you disability claim.{' '}
          <strong>
            If a dependents status has changed, you need to let the VA know.
          </strong>
        </p>
        <ViewDependentsListItem
          onAward
          social="312-314-1415"
          birthdate="05/05/1982"
          age={37}
        />
        <h3>Dependents not on award</h3>
        <p>
          Dependents not on award may be awaiting a decision, or they were once
          added to your disability claim and their status has changed.{' '}
          <strong>Let the VA know if a dependent's status has changed</strong>{' '}
          and they are now eligible to be added to your disability claim.
        </p>
        <ViewDependentsListItem
          onAward
          social="312-314-1415"
          birthdate="05/05/1982"
          age={37}
        />
      </>
    );
  }
}

export default ViewDependentsList;
