import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from 'platform/utilities/ui';

import { MAX_LENGTH } from '../constants';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const ContestableIssuesLegend = ({ onReviewPage, inReviewMode }) => {
  let Wrap = 'h3';
  const wrapClassNames = ['vads-u-font-size--h3'];
  if (onReviewPage) {
    // Using a div in review mode, see
    // https://dsva.slack.com/archives/C8E985R32/p1672863010797129?thread_ts=1672860474.162309&cid=C8E985R32
    Wrap = inReviewMode ? 'div' : 'h4';
    wrapClassNames.push(
      'vads-u-font-family--serif',
      `vads-u-margin-top--${inReviewMode ? '2' : '0'}`,
    );
  } else {
    wrapClassNames.push('vads-u-margin-top--0');
  }
  return onReviewPage && inReviewMode ? null : (
    <>
      <legend className="vads-u-width--full vads-u-padding-top--0 vads-u-border-top--0">
        <Wrap className={wrapClassNames.join(' ')}>
          Select the issues you’d like us to review
        </Wrap>
      </legend>
      <div className="vads-u-margin-bottom--2">
        These are the issues we have on file for you. If an issue is missing
        from the list, you can add it here.
      </div>
    </>
  );
};

ContestableIssuesLegend.propTypes = {
  inReviewMode: PropTypes.bool,
  onReviewPage: PropTypes.bool,
};

export const maxSelectedErrorMessage =
  'You’ve reached the maximum number of allowed selected issues';

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal, appName }) => (
  <VaModal
    modalTitle={maxSelectedErrorMessage}
    status="warning"
    onCloseEvent={closeModal}
    visible
    uswds
  >
    You are limited to {MAX_LENGTH.SELECTIONS} selected issues for each{' '}
    {appName} request. If you would like to select more than{' '}
    {MAX_LENGTH.SELECTIONS}, submit this request and create a new request for
    the remaining issues.
  </VaModal>
);

MaxSelectionsAlert.propTypes = {
  appName: PropTypes.string,
  closeModal: PropTypes.func,
};

export const MessageAlert = ({
  title,
  message,
  headerLevel = 3,
  errorKey,
  errorReason,
  classes = 'vads-u-margin-bottom--2',
}) => {
  const wrapAlert = useRef(null);
  const Header = `h${headerLevel}`;

  useEffect(
    () => {
      if (wrapAlert?.current) {
        scrollAndFocus(wrapAlert.current);
      }
    },
    [wrapAlert],
  );

  recordEvent({
    event: 'visible-alert-box',
    'alert-box-type': 'error',
    'alert-box-heading': title,
    'error-key': errorKey,
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': errorReason,
  });

  return (
    <div ref={wrapAlert}>
      <va-alert status="error" class={classes} uswds>
        <Header slot="headline" className="eligible-issues-error">
          {title}
        </Header>
        <p>{message}</p>
      </va-alert>
    </div>
  );
};

MessageAlert.propTypes = {
  classes: PropTypes.string,
  errorKey: PropTypes.string,
  errorReason: PropTypes.string,
  headerLevel: PropTypes.number,
  message: PropTypes.string,
  title: PropTypes.string,
};

export const ApiFailureAlert = () => (
  <MessageAlert
    title="We can’t load your issues right now"
    message={`You can come back later, or if you’d like to add your issue manually, you can select "Add a new issue" to get started.`}
    errorKey="api_load_error"
    errorReason="API load error"
  />
);

export const NoEligibleIssuesAlert = () => (
  <MessageAlert
    title="Sorry, we couldn’t find any eligible issues"
    message={`If you’d like to add your issue for review, select "Add a new issue" to get started.`}
    errorKey="no_eligible_issues_loaded"
    errorReason="No eligible issues loaded"
  />
);

export const noneSelected =
  'You must select at least 1 issue before you can continue filling out your request.';

/**
 * Shows the alert box only if the form has been submitted
 */
export const NoneSelectedAlert = ({ count, headerLevel = 3, inReviewMode }) => {
  const title = `You’ll need to ${
    count === 0 ? 'add, and select,' : 'select'
  } an issue`;
  const classes = `vads-u-margin-${inReviewMode ? 'y' : 'bottom'}--2`;

  return (
    <MessageAlert
      title={title}
      message={noneSelected}
      headerLevel={headerLevel}
      errorKey="no_eligible_issues_selected"
      errorReason="No eligible issues selected"
      classes={classes}
    />
  );
};

NoneSelectedAlert.propTypes = {
  count: PropTypes.number,
  headerLevel: PropTypes.number,
  inReviewMode: PropTypes.bool,
};

export const ContestableIssuesAdditionalInfo = (
  <va-additional-info trigger="Why isn’t my issue listed here?" uswds>
    If you don’t see your issue or decision listed here, it may not be in our
    system yet. This can happen if it’s a more recent claim decision. If you
    have a decision date, you can add a new issue now.
  </va-additional-info>
);

export const removeModalContent = {
  title: 'Are you sure you want to remove this issue?',
  description: issueName => (
    <span>
      We’ll remove{' '}
      <strong className="dd-privacy-hidden" data-dd-action-name="issue name">
        {issueName}
      </strong>{' '}
      from the issues you’d like us to review
    </span>
  ),
  yesButton: 'Yes, remove this',
  noButton: 'No, keep this',
};
