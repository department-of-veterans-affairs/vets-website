import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { PREFILL_STATUSES } from '../../../../platform/forms/save-in-progress/actions';
import get from '../../../../platform/utilities/data/get';

/**
 * Gates rendering the form based on whether there are any eligible disabilities.
 * Note: This could also be done in ITFWrapper, but I wanted a clear separation of concerns. If
 *  it creates any problems later, we can combine the two into a single FormGate or something.
 */
export const DisabilityGate = ({
  prefillStatus,
  disabilities = [],
  children,
}) => {
  // Only attempt to gate if the pre-fill came back with data
  if (
    [PREFILL_STATUSES.notAttempted, PREFILL_STATUSES.pending].includes(
      prefillStatus,
    )
  ) {
    return children;
  }

  if (prefillStatus === PREFILL_STATUSES.unfilled) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="We're sorry"
          content="Our system is having trouble retrieving your rated disabilites at this time."
          status="error"
        />
      </div>
    );
  }

  // We now have a successful pre-fill; check that we have eligible disabilities
  // (The prefillTransformer removed ineligible disabilities)
  if (!disabilities.length) {
    return (
      <div className="usa-grid full-page-alert">
        <AlertBox
          isVisible
          headline="We're sorry"
          content="Our records show you don’t have any rated disabilities, so you can’t apply for increased compensation benefits at this time. If you think our records aren’t correct, please call Veterans Benefits Assistance at 1-800-827-1000, Monday – Friday, 8:00 a.m. to 9:00 p.m. (ET)."
          status="error"
        />
      </div>
    );
  }

  // There is at least one eligible disability; render the form
  return children;
};

const mapStateToProps = store => ({
  prefillStatus: store.form.prefillStatus,
  disabilities: get('form.data.disabilities', store),
});

export default connect(mapStateToProps)(DisabilityGate);
