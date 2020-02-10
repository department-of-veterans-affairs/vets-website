import React from 'react';
import PropTypes from 'prop-types';

const ViewDependentsListItem = props => (
  <dl className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--2 vads-u-padding-bottom--3 vads-u-padding-x--2">
    <dt className="vads-l-row">
      <dfn className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--lg">
        {props.name}
      </dfn>
    </dt>
    <dd className="vads-l-row">
      <dfn className="vads-u-margin--0">
        <strong>Relationship:</strong> {props.spouse ? 'Spouse' : 'Child'}
      </dfn>
    </dd>
    <dd className="vads-l-row">
      {props.social ? (
        <dfn className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <strong>SSN:</strong> {props.social}
        </dfn>
      ) : null}
    </dd>
    <dd className="vads-l-row">
      {props.birthdate ? (
        <dfn className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <strong>Date of birth:</strong> {props.birthdate}
        </dfn>
      ) : null}
    </dd>
  </dl>
);

ViewDependentsListItem.propTypes = {
  name: PropTypes.string,
  spouse: PropTypes.bool,
  social: PropTypes.string,
  birthdate: PropTypes.string,
  age: PropTypes.number,
};

export default ViewDependentsListItem;
