import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';

import ManageDependents from '../../manage-dependents/containers/ManageDependentsApp';
import { maskID } from '../../../shared/utils';

function ViewDependentsListItem(props) {
  const [open, setOpen] = useState(false);

  const {
    manageDependentsToggle,
    firstName,
    lastName,
    relationship,
    ssn,
    dateOfBirth,
    age,
    removalDate,
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

  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="vads-u-margin-bottom--3">
      <va-card>
        <h3 className="vads-u-margin-top--0">{fullName}</h3>
        <dl className="vads-u-margin-top--1 vads-u-margin-bottom--1">
          <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
            <dt>Relationship:&nbsp;</dt>
            <dd>{relationship}</dd>
          </div>

          {dateOfBirth && (
            <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
              <dt>Date of birth:&nbsp;</dt>
              <dd>{moment(dateOfBirth).format('MMMM D, YYYY')}</dd>
            </div>
          )}

          {age && (
            <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
              <dt>Age:&nbsp;</dt>
              <dd
                className="dd-privacy-mask"
                data-dd-action-name="Dependent's age"
              >
                {age} years old
              </dd>
            </div>
          )}

          {ssn && (
            <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
              <dt>SSN:&nbsp;</dt>
              <dd
                className="dd-privacy-mask"
                data-dd-action-name="Dependent's SSN"
              >
                {maskID(ssn)}
              </dd>
            </div>
          )}

          {removalDate && (
            <>
              <div className="vads-u-margin-top--2">
                <dt className="vads-u-font-weight--bold vads-u-display--inline-block vads-u-width--auto">
                  Automatic removal date:&nbsp;
                </dt>
                <dd className="vads-u-display--inline-block vads-u-width--auto">
                  <span
                    className="dd-privacy-mask"
                    data-dd-action-name="Dependent's removal date"
                  >
                    {moment(removalDate).format('MMMM D, YYYY')}
                  </span>
                </dd>
              </div>

              <va-alert
                status="info"
                background-only
                visible
                class="vads-u-margin-top--1"
              >
                <p>
                  <strong>
                    We’ll remove this child from your disability benefits when
                    they turn 18.
                  </strong>{' '}
                  This could lower your monthly benefit payment. If they’ll
                  continue attending school after that, you’ll need to add them
                  again if you haven’t already. If you need to add your child
                  back,&nbsp;
                  <va-link
                    href="/exit-form"
                    text="submit a request to add or remove dependents"
                  />
                  .
                </p>
              </va-alert>
            </>
          )}
        </dl>

        {manageDependentsToggle && (
          <div className="vads-l-col--12">
            {!open && (
              <button
                type="button"
                onClick={handleClick}
                className="usa-button-secondary vads-u-background-color--white"
                disabled={
                  openFormlett || submittedDependents.includes(stateKey)
                }
                aria-label={`remove ${fullName} as a dependent`}
              >
                Remove this dependent
              </button>
            )}

            {open && (
              <div className="vads-l-col--12">
                <p className="vads-u-font-size--h3">Equal to VA Form 21-686c</p>
                <p>
                  To remove this dependent from your VA benefits, please enter
                  the information below.
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
      </va-card>
    </div>
  );
}

const mapStateToProps = state => ({
  openFormlett: state?.removeDependents?.openFormlett,
  submittedDependents: state?.removeDependents?.submittedDependents,
});

export default connect(mapStateToProps)(ViewDependentsListItem);
export { ViewDependentsListItem };

ViewDependentsListItem.propTypes = {
  dateOfBirth: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  age: PropTypes.number,
  removalDate: PropTypes.string,
  manageDependentsToggle: PropTypes.bool,
  openFormlett: PropTypes.bool,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  stateKey: PropTypes.number,
  submittedDependents: PropTypes.array,
};
