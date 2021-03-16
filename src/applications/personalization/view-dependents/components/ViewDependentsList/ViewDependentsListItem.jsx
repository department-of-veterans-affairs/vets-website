import React, { useState } from 'react';
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
          className="vads-l-col--12 vads-u-margin--0 vads-u-font-size--lg vads-u-font-weight--bold mng-dependents-name"
        >
          {firstName} {lastName}
        </dt>

        <dd className="vads-l-col--12 vads-u-margin--0">
          <dfn title="relationship" className="vads-u-font-weight--bold">
            Relationship:
          </dfn>{' '}
          {relationship}
        </dd>

        {ssn ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn title="ssn" className="vads-u-font-weight--bold">
              SSN:
            </dfn>{' '}
            {ssn}
          </dd>
        ) : null}

        {dateOfBirth ? (
          <dd className="vads-l-col--12 vads-u-margin--0">
            <dfn title="birthdate" className="vads-u-font-weight--bold">
              Date of birth:{' '}
            </dfn>
            {moment(dateOfBirth).format('MMMM D, YYYY')}
          </dd>
        ) : null}
      </dl>
      {manageDependentsToggle && (
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {!open && (
            <button
              type="button"
              onClick={handleClick}
              className="usa-button-secondary vads-u-background-color--white"
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
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ViewDependentsListItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  dateOfBirth: PropTypes.string,
  stateKey: PropTypes.number,
};

export default ViewDependentsListItem;
