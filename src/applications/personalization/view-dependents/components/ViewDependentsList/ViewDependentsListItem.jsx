import React from 'react';
import PropTypes from 'prop-types';

function ViewDependentsListItem(props) {
  return (
    <dl className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      <dd className="vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold">
        {props.firstName} {props.lastName}
      </dd>

      <dd className="vads-l-col--12 vads-u-margin--0">
        <span className="vads-u-font-weight--bold">Relationship:</span>{' '}
        {props.relationship}
      </dd>

      {props.ssn ? (
        <dd className="vads-l-col--12 vads-u-margin--0">
          <span className="vads-u-font-weight--bold">SSN:</span> {props.ssn}
        </dd>
      ) : null}

      {props.dateOfBirth ? (
        <dd className="vads-l-col--12 vads-u-margin--0">
          <span className="vads-u-font-weight--bold">Date of birth: </span>
          {props.dateOfBirth}
        </dd>
      ) : null}
    </dl>
  );
}

ViewDependentsListItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  dateOfBirth: PropTypes.string,
};

export default ViewDependentsListItem;
