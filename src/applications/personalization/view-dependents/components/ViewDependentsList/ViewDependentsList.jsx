import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import ViewDependentsListItem from '../ViewDependentsList/ViewDependentsListItem';

class ViewDependentsList extends Component {
  render() {
    let mainContent;

    if (this.props.loading) {
      mainContent = (
        <LoadingIndicator message="Loading your dependents" setFocus />
      );
    } else if (this.props.dependents && this.props.dependents.length > 0) {
      mainContent = this.props.dependents.map((dependent, index) => (
        <ViewDependentsListItem key={index} {...dependent} />
      ));
    } else {
      mainContent = <p>No dependents in this list.</p>;
    }

    return (
      <>
        <h2>{this.props.header}</h2>
        <p>{this.props.subHeader}</p>
        <a
          className="vads-u-display--block vads-u-margin-bottom--4"
          href={this.props.link}
        >
          {this.props.linkText}
        </a>
        {mainContent}
      </>
    );
  }
}

ViewDependentsList.propTypes = {
  dependents: PropTypes.array,
  header: PropTypes.string,
  subHeader: PropTypes.object,
};

export default ViewDependentsList;
