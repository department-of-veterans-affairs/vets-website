import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  parse,
  isValid,
  format,
  differenceInCalendarDays,
  add,
} from 'date-fns';

import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ManageDependents from '../../manage-dependents/containers/ManageDependentsApp';
import { maskID, calculateAge } from '../../../shared/utils';

/**
 * @typedef ViewDependentsListItemProps
 * @property {boolean} manageDependentsToggle
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} relationship
 * @property {string} ssn
 * @property {string} dateOfBirth
 * @property {string} upcomingRemoval
 * @property {number} stateKey
 * @property {boolean} openFormlett
 * @property {Array} submittedDependents
 */
/**
 * View Dependents list item
 * Show a single dependent card
 * @param {ViewDependentsListItemProps} props - Component props
 * @returns {JSX.Element} Dependent card
 */
function ViewDependentsListItem(props) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(null);

  const {
    manageDependentsToggle,
    firstName,
    lastName,
    relationship,
    ssn,
    dateOfBirth,
    upcomingRemoval,
    stateKey,
    openFormlett,
    submittedDependents,
  } = props;

  useEffect(
    () => {
      if (openRef.current) {
        scrollTo(openRef.current);
        focusElement(openRef.current);
      }
    },
    [open],
  );

  const handleClick = () => {
    setOpen(prevState => !prevState);
    if (open) {
      setTimeout(() => {
        const card = $$('va-card')?.[stateKey];
        const button = $('va-button[text*="Remove"]', card);
        focusElement('button', {}, button?.shadowRoot);
        scrollTo(button);
      });
    }
  };

  const fullName = `${firstName} ${lastName}`;

  const dobObj = parse(dateOfBirth, 'MM/dd/yyyy', new Date());
  const removalDate = upcomingRemoval
    ? parse(upcomingRemoval, 'MM/dd/yyyy', new Date())
    : '';
  const ageInYears = calculateAge(dateOfBirth);
  const upcomingBirthday = isValid(dobObj) ? add(dobObj, { years: 18 }) : null;

  const differenceInDays = differenceInCalendarDays(
    add(new Date(), { days: 90 }),
    upcomingBirthday,
  );
  const isUpcomingWithin90Days = upcomingBirthday
    ? differenceInDays >= 0 && differenceInDays <= 90
    : false;

  return (
    <div className="vads-u-margin-bottom--3">
      <va-card>
        <h3 className="vads-u-margin-top--0">
          <span className="dd-privacy-hidden" data-dd-action-name="full name">
            {fullName}
          </span>
        </h3>
        <dl className="vads-u-margin-top--1 vads-u-margin-bottom--1">
          <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
            <dt>Relationship:&nbsp;</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="relationship"
            >
              {relationship}
            </dd>
          </div>

          {isValid(dobObj) && (
            <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
              <dt>Date of birth:&nbsp;</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="date of birth"
              >
                {format(dobObj, 'MMMM d, yyyy')}
              </dd>
            </div>
          )}

          {ageInYears && (
            <div className="vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
              <dt>Age:&nbsp;</dt>
              <dd
                className="dd-privacy-mask"
                data-dd-action-name="Dependent's age"
              >
                {ageInYears.labeledAge}
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
                    {format(new Date(removalDate), 'MMMM d, yyyy')}
                  </span>
                </dd>
              </div>

              {isUpcomingWithin90Days && (
                <va-alert
                  status="info"
                  background-only
                  visible
                  className="vads-u-margin-top--1"
                >
                  <p>
                    We’ll remove this child from your disability benefits when
                    they turn 18. This could lower your monthly benefit payment.
                    If they’ll continue attending school after that, you’ll need
                    to add them again if you haven’t already. If you need to add
                    your child back,&nbsp;
                    <va-link
                      href="/exit-form"
                      text="submit a request to add or remove dependents"
                    />
                    .
                  </p>
                  <p>
                    <strong>Note:</strong> If your child became permanently
                    disabled before age 18, they’ll remain on your benefits. You
                    don’t need to do anything.
                  </p>
                </va-alert>
              )}
            </>
          )}
        </dl>

        {manageDependentsToggle && (
          <div className="vads-l-col--12">
            {!open && (
              <va-button
                onClick={handleClick}
                secondary
                disabled={
                  openFormlett || submittedDependents.includes(stateKey) || null
                }
                label={`remove ${fullName} as a dependent`}
                text="Remove this dependent"
              />
            )}

            {open && (
              <div className="vads-l-col--12">
                <h4
                  ref={openRef}
                  className="vads-u-font-size--h3"
                  aria-describedby="remove-dependent-instructions"
                >
                  Equal to VA Form 21-686c
                </h4>
                <p id="remove-dependent-instructions">
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
  submittedDependents: state?.removeDependents?.submittedDependents || [],
});

export default connect(mapStateToProps)(ViewDependentsListItem);
export { ViewDependentsListItem };

ViewDependentsListItem.propTypes = {
  age: PropTypes.number,
  dateOfBirth: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  manageDependentsToggle: PropTypes.bool,
  openFormlett: PropTypes.bool,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  stateKey: PropTypes.number,
  submittedDependents: PropTypes.array,
  upcomingRemoval: PropTypes.string,
};
