import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format, parse } from 'date-fns';

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
    stateKey,
    openFormlett,
    submittedDependents,
    vadvToggle,
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

  const content = (
    <div className="mng-dependents-list-item vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding--2">
      <h3 className="vads-u-font-family--serif vads-u-font-size--lg vads-u-margin-top--0 mng-dependents-name">
        {fullName}
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
          <dd>{relationship}</dd>
        </div>

        {ssn ? (
          <div>
            <dt>SSN:&nbsp;</dt>
            <dd>{maskID(ssn)}</dd>
          </div>
        ) : null}

        {dateOfBirth ? (
          <div>
            <dt>Date of birth:&nbsp;</dt>
            <dd>
              {dateOfBirth
                ? format(
                    parse(dateOfBirth, 'MM/dd/yyyy', new Date()),
                    'MMMM d, yyyy',
                  )
                : ''}
            </dd>
          </div>
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
              aria-label={`remove ${fullName} as a dependent`}
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

  const vadvContent = (
    <div className="mng-dependents-list-item">
      <h3 className="vads-u-font-family--serif vads-u-font-size--lg vads-u-margin-top--0 mng-dependents-name">
        {fullName}
      </h3>
      <dl>
        <div>
          <dt>Relationship:&nbsp;</dt>
          <dd>{relationship}</dd>
        </div>

        {ssn ? (
          <div>
            <dt>SSN:&nbsp;</dt>
            <dd>{maskID(ssn)}</dd>
          </div>
        ) : null}

        {dateOfBirth ? (
          <div>
            <dt>Date of birth:&nbsp;</dt>
            <dd>
              {dateOfBirth
                ? format(
                    parse(dateOfBirth, 'MM/dd/yyyy', new Date()),
                    'MMMM d, yyyy',
                  )
                : ''}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  return vadvToggle ? vadvContent : content;
}

const mapStateToProps = state => ({
  openFormlett: state?.removeDependents?.openFormlett,
  submittedDependents: state?.removeDependents?.submittedDependents,
});

export default connect(
  mapStateToProps,
  null,
)(ViewDependentsListItem);

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
