import React, { useState } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';
import ManageDependents from '../../manage-dependents/containers/ManageDependentsApp';

const scroller = Scroll.scroller;
const scrollToTop = el => {
  scroller.scrollTo(el, {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

function ViewDependentsListItem(props) {
  const [open, setOpen] = useState(false);

  const {
    manageDependentsToggle,
    firstName,
    lastName,
    relationship,
    ssn,
    dateOfBirth,
    stateKey,
    openFormlett,
    submittedDependents,
  } = props;

  const handleClick = () => {
    setOpen(prevState => !prevState);
    if (open) {
      const focusEl = document?.querySelectorAll('.mng-dependents-name')?.[
        stateKey
      ];
      focusElement(focusEl);
      scrollToTop(focusEl);
    }
  };

  return (
    <div className="vads-l-row vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-x--2">
      <dl
        className={classNames({
          'vads-l-row': true,
          'vads-u-margin-bottom--0': manageDependentsToggle === true,
          'vads-u-margin-bottom--2': manageDependentsToggle === false,
        })}
      >
        <dt
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex="-1"
          className="vads-u-font-family--serif vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold mng-dependents-name"
        >
          {firstName} {lastName}
        </dt>
        {manageDependentsToggle && submittedDependents.includes(stateKey) && (
          <dd
            aria-live="polite"
            className="vads-l-col--12 vads-u-margin-y--1p5"
          >
            <dfn title="status">
              <i
                aria-hidden="true"
                role="img"
                className="fas fa-exclamation-triangle"
              />{' '}
              Status:
            </dfn>{' '}
            Removal of dependent pending
          </dd>
        )}
        <dd className="vads-l-col--12 vads-u-margin--0">
          <dfn title="relationship">Relationship:</dfn> {relationship}
        </dd>

        {ssn ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn title="ssn">SSN:</dfn> {ssn.replace(/[0-9](?=.{4,}$)/g, '*')}
          </dd>
        ) : null}

        {dateOfBirth ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn title="birthdate">Date of birth: </dfn>
            {moment(dateOfBirth).format('MMMM D, YYYY')}
          </dd>
        ) : null}
      </dl>
      {manageDependentsToggle && (
        <div className="vads-l-col--12">
          {!open && (
            <button
              type="button"
              onClick={handleClick}
              className="usa-button-secondary vads-u-background-color--white"
              disabled={openFormlett || submittedDependents.includes(stateKey)}
            >
              Remove this dependent
            </button>
          )}
          {open && (
            <div className="vads-l-col--12">
              <p className="vads-u-font-size--h3">Equal to VA Form 21-686c</p>
              <p>
                To remove this dependent from your VA benefits, please enter the
                information below.
              </p>
              <ManageDependents
                relationship={relationship}
                closeFormHandler={handleClick}
                stateKey={stateKey}
                userInfo={{
                  fullName: { firstName, lastName },
                  dateOfBirth,
                  ssn,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  openFormlett: state?.removeDependents?.openFormlett,
  submittedDependents: state?.removeDependents?.submittedDependents,
});

export default connect(mapStateToProps, null)(ViewDependentsListItem);

export { ViewDependentsListItem };

ViewDependentsListItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  dateOfBirth: PropTypes.string,
  stateKey: PropTypes.number,
};
