import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function ViewDependentsListItem(props) {
  return (
    <dl className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      <dt className="vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold">
        {props.firstName} {props.lastName}
      </dt>

      <dd className="vads-l-col--12 vads-u-margin--0">
        <dfn className="vads-u-font-weight--bold">Relationship:</dfn>{' '}
        {props.relationship}
      </dd>

      {props.ssn ? (
        <dd className="vads-l-col--12 vads-u-margin--0">
          <dfn className="vads-u-font-weight--bold">SSN:</dfn> {props.ssn}
        </dd>
      ) : null}

      {props.dateOfBirth ? (
        <dd className="vads-l-col--12 vads-u-margin--0">
          <dfn className="vads-u-font-weight--bold">Date of birth: </dfn>
          {moment(props.dateOfBirth).format('MMMM D, YYYY')}
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
