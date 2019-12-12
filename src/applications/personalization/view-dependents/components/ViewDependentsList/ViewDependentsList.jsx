import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewDependentsListItem from '../ViewDependentsList/ViewDependentsListItem';

class ViewDependentsList extends Component {
  render() {
    let mainContent;

    if (this.props.dependents) {
      mainContent = this.props.dependents.map((dependent, index) => (
        <ViewDependentsListItem
          key={index}
          name={dependent.name}
          spouse={dependent.spouse}
          onAward={dependent.onAward}
          social={dependent.social}
          birthdate={dependent.birthdate}
          age={dependent.age}
        />
      ));
    } else {
      mainContent = <p>No dependents in this list.</p>;
    }

    return (
      <div>
        <h3>{this.props.header}</h3>
        <p className="vads-u-padding-bottom--2">{this.props.subHeader}</p>
        {mainContent}
      </div>
    );
  }
}

ViewDependentsList.propTypes = {
  dependents: PropTypes.array,
  header: PropTypes.string,
  subHeader: PropTypes.object,
};

export default ViewDependentsList;
