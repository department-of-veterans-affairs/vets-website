import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ViewDependentsListItem extends Component {
  render() {
    return (
      <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
        <div className="vads-l-row">
          <p className="vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold">
            {`${this.props.firstName} ${this.props.lastName}`}
          </p>

          <p className="vads-l-col--12 vads-u-margin--0">
            <span className="vads-u-font-weight--bold">Relationship:</span>{' '}
            {this.props.relationship}
          </p>

          {this.props.ssn ? (
            <p className="vads-l-col--12 vads-u-margin--0">
              <span className="vads-u-font-weight--bold">SSN:</span>{' '}
              {this.props.ssn}
            </p>
          ) : null}

          {this.props.dateOfBirth ? (
            <p className="vads-l-col--12 vads-u-margin--0">
              <span className="vads-u-font-weight--bold">Date of birth: </span>
              {this.props.dateOfBirth}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}

ViewDependentsListItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  dateOfBirth: PropTypes.string,
};

export default ViewDependentsListItem;
