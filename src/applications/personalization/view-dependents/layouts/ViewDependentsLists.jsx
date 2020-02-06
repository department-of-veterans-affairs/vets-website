import React, { Component } from 'react';
import ViewDependentsList from '../components/ViewDependentsList/ViewDependentsList';

class ViewDependentsLists extends Component {
  render() {
    const onAwardSubhead = (
      <>Dependents on award have been added to you disability claim.</>
    );

    const notOnAwardSubhead = (
      <>
        Dependents not on award may be awaiting a decision, or they were once
        added to your disability claim and their status has changed.
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
