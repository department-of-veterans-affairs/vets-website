import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

function ViewDependentsListItem(props) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(prevState => !prevState);
  };

  const {
    manageDependentsToggle,
    firstName,
    lastName,
    relationship,
    ssn,
    dateOfBirth,
  } = props;
  return (
    <div className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2">
      <dl
        className={classNames({
          'vads-l-row vads-u-padding-x--2': true,
          'vads-u-margin-bottom--0': manageDependentsToggle === true,
          'vads-u-margin-bottom--2': manageDependentsToggle === false,
        })}
      >
        <dt className="vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold">
          {firstName} {lastName}
        </dt>

        <dd className="vads-l-col--12 vads-u-margin--0">
          <dfn className="vads-u-font-weight--bold">Relationship:</dfn>{' '}
          {relationship}
        </dd>

        {ssn ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn className="vads-u-font-weight--bold">SSN:</dfn> {ssn}
          </dd>
        ) : null}

        {dateOfBirth ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn className="vads-u-font-weight--bold">Date of birth: </dfn>
            {moment(dateOfBirth).format('MMMM D, YYYY')}
          </dd>
        ) : null}
      </dl>
      {manageDependentsToggle && (
        <button
          onClick={handleClick}
          className="usa-button-secondary vads-u-margin-x--2 vads-u-background-color--white"
        >
          Remove this dependent
        </button>
      )}
      <div
        className={`vads-l-row vads-l-row vads-u-padding-x--2 vads-u-display--${
          open ? 'flex' : 'none'
        }`}
      >
        <div className="vads-l-col--8">
          <p>
            To remove this dependent from your VA benefits, please enter the
            information below.
          </p>
        </div>
      </div>
    </div>
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
