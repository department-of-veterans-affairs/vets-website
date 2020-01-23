import React, { Component } from 'react';
import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsList';

class ViewDependentsLists extends Component {
  render() {
    /*
    const onAwardDependents = [
      {
        name: 'Billy Bush',
        onAward: true,
        social: '312-314-1415',
        birthdate: '05/05/1982',
        age: 32,
      },
    ];

    const notOnAwardDependents = [
      {
        name: 'De Angelo Barksdale',
        spouse: true,
        onAward: true,
        social: '312-314-1415',
        birthdate: '05/05/1982',
        age: 32,
      },
    ];
    */

    const onAwardSubhead = (
      <>
        Dependents on award have been added to you disability claim.{' '}
        <strong>
          If a dependents status has changed, you need to let the VA know.
        </strong>
      </>
    );

    const notOnAwardSubhead = (
      <>
        Dependents not on award may be awaiting a decision, or they were once
        added to your disability claim and their status has changed.{' '}
        <strong>Let the VA know if a dependent's status has changed</strong> and
        they are now eligible to be added to your disability claim.
      </>
    );

    return (
      <div>
        <ViewDependentsList
          loading={this.props.loading}
          header="Dependents on award"
          subHeader={onAwardSubhead}
          dependents={this.props.onAwardDependents}
        />
        <ViewDependentsList
          loading={this.props.loading}
          header="Dependents not on award"
          subHeader={notOnAwardSubhead}
          dependents={this.props.notOnAwardDependents}
        />
      </div>
    );
  }
}

export default ViewDependentsLists;
