import React from 'react';
import PropTypes from 'prop-types';

const ViewDependentsListItem = props => (
  <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--2 vads-u-padding-bottom--3 vads-u-padding-x--2">
    <div className="vads-l-row">
      <p className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--lg">
        {props.name}
      </p>
    </div>
    <div className="vads-l-row">
      <p className="vads-u-margin--0">
        <strong>Relationship:</strong> {props.spouse ? 'Spouse' : 'Child'}
      </p>
    </div>
    <div className="vads-l-row">
      {props.social ? (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <strong>SSN:</strong> {props.social}
        </p>
      ) : null}
    </div>
    <div className="vads-l-row">
      {props.birthdate ? (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <strong>Date of birth:</strong> {props.birthdate}
        </p>
      ) : null}
    </div>
  </div>
);

ViewDependentsListItem.propTypes = {
  name: PropTypes.string,
  spouse: PropTypes.bool,
  social: PropTypes.string,
  birthdate: PropTypes.string,
  age: PropTypes.number,
};

export default ViewDependentsListItem;
