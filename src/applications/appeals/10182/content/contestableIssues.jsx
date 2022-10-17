import React, { useEffect, useRef } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollAndFocus } from 'platform/utilities/ui';

import { MAX_LENGTH } from '../constants';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const ContestableIssuesTitle = ({ formData = {} } = {}) => {
  if (formData.contestableIssues?.length === 0) {
    return (
      <>
        <h2
          className="vads-u-font-size--h4 vads-u-margin-top--0"
          name="eligibleScrollElement"
        >
          Sorry, we couldn’t find any eligible issues
        </h2>
        <p>
          If you’d like to add an issue for review, please select "Add a new
          issue" to get started.
        </p>
      </>
    );
  }
  return (
    <>
      <div className="vads-u-margin-bottom--2">
        These issues are in your VA record. If an issue is missing from this
        list, you can add it.
      </div>
      <legend
        name="eligibleScrollElement"
        className="vads-u-font-weight--normal vads-u-font-size--base"
      >
        Select the issue(s) you’d like us to review:
      </legend>
    </>
  );
};

// The ContestableIssuesTitle is first so screenreaders read it first, but visually
// it is last to match the design (managed by CSS order)
export const EligibleIssuesDescription = props => (
  <>
    <ContestableIssuesTitle {...props} />
    <div>
      These issues are in your VA record. If an issue is missing from this list,
      you can add it on the next step.
    </div>
  </>
);

export const maxSelectedErrorMessage =
  'You’ve reached the maximum number of allowed selected issues';

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal }) => (
  <VaModal
    modalTitle={maxSelectedErrorMessage}
    status="warning"
    onCloseEvent={closeModal}
    visible
  >
    You are limited to {MAX_LENGTH.SELECTIONS} selected issues for each Notice
    of Disagreement request. If you would like to select more than{' '}
    {MAX_LENGTH.SELECTIONS}, please submit this request and create a new request
    for the remaining issues.
  </VaModal>
);

export const noneSelected = 'Please select at least one issue';

export const NotListedInfo = (
  <va-additional-info trigger="Why aren’t all my issues listed here?">
    <p className="vads-u-margin-top--0">
      If you don’t see your issue or decision listed here, it may not be in our
      system yet. This can happen if it’s a more recent claim decision. We may
      still be processing it.
    </p>
  </va-additional-info>
);

/**
 * Shows the alert box only if the form has been submitted
 */
export const NoneSelectedAlert = ({ count }) => {
  const wrapAlert = useRef(null);

  useEffect(
    () => {
      if (wrapAlert?.current) {
        scrollAndFocus(wrapAlert.current);
      }
    },
    [wrapAlert],
  );
  return (
    <div ref={wrapAlert}>
      <va-alert status="error">
        <h3
          slot="headline"
          className="eligible-issues-error vads-u-margin-x--2 vads-u-margin-y--1 vads-u-padding-x--3 vads-u-padding-y--2"
        >
          {`Please ${
            count === 0 ? 'add, and select,' : 'select'
          } at least one issue, so we can process your request`}
        </h3>
      </va-alert>
    </div>
  );
};

export const disabilitiesExplanation = (
  <va-additional-info trigger="Why isn’t my issue listed here?">
    If you don’t see your issue or decision listed here, it may not be in our
    system yet. This can happen if it’s a more recent claim decision. We may
    still be processing it.
  </va-additional-info>
);
