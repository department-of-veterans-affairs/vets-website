import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ManageDependents from '../../manage-dependents/containers/ManageDependentsApp';
import { maskID } from '../../../shared/utils';

/**
 * @typedef {Object} ViewDependentsListItemProps
 * @property {string} firstName - dependent's first name
 * @property {string} lastName - dependent's last name
 * @property {string} relationship - dependent's relationship to user
 * @property {string} ssn - dependent's social security number
 * @property {string} dateOfBirth - dependent's date of birth
 * @property {number} stateKey - index key for dependent
 * @property {boolean} manageDependentsToggle - whether manage dependents
 * feature is enabled
 * @property {boolean} openFormlett - whether formlett is open
 * @property {Array} submittedDependents - list of successfully submitted
 * dependents
 *
 * @param {ViewDependentsListItemProps} props - component props
 * @returns {JSX.Element} - ViewDependentsListItem component
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
    stateKey,
    openFormlett,
    submittedDependents,
  } = props;

  useEffect(() => {
    if (openRef.current) {
      scrollTo(openRef.current);
      focusElement(openRef.current);
    }
  }, [open]);

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

  return (
    <div className="mng-dependents-list-item vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding--2">
      <h3 className="vads-u-font-family--serif vads-u-font-size--lg vads-u-margin-top--0 mng-dependents-name">
        <span className="dd-privacy-hidden" data-dd-action-name="full name">
          {fullName}
        </span>
      </h3>
      <dl
        className={`vads-u-margin-bottom--${
          manageDependentsToggle ? '0p5' : '1'
        }`}
      >
        {manageDependentsToggle && submittedDependents.includes(stateKey) ? (
          <div aria-live="polite">
            <dt>
              <va-icon icon="warning" size={3} /> Status:&nbsp;
            </dt>
            <dd>Removal of dependent pending</dd>
          </div>
        ) : null}
        <div>
          <dt>Relationship:&nbsp;</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="relationship">
            {relationship}
          </dd>
        </div>

        {ssn ? (
          <div>
            <dt>SSN:&nbsp;</dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="ssn">
              {maskID(ssn)}
            </dd>
          </div>
        ) : null}

        {dateOfBirth ? (
          <div>
            <dt>Date of birth:&nbsp;</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="date of birth"
            >
              {format(new Date(dateOfBirth), 'MMMM d, yyyy')}
            </dd>
          </div>
        ) : null}
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
  submittedDependents: state?.removeDependents?.submittedDependents || [],
});

export default connect(mapStateToProps, null)(ViewDependentsListItem);

export { ViewDependentsListItem };

ViewDependentsListItem.propTypes = {
  dateOfBirth: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  manageDependentsToggle: PropTypes.bool,
  openFormlett: PropTypes.bool,
  relationship: PropTypes.string,
  ssn: PropTypes.string,
  stateKey: PropTypes.number,
  submittedDependents: PropTypes.array,
};
