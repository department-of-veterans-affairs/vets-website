import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildDateFormatter } from '../../utils/helpers';
import * as TrackedItem from '../../utils/trackedItemContent';
import {
  // START ligthouse_migration
  submit5103 as submit5103Action,
  // END lighthouse_migration
} from '../../actions';
import { setUpPage } from '../../utils/page';

import withRouter from '../../utils/withRouter';

function Default5103EvidenceNotice({
  decisionRequestError,
  decisionRequested,
  loadingDecisionRequest,
  item,
  navigate,
  params,
  submit5103,
}) {
  const [addedEvidence, setAddedEvidence] = useState(false);
  const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(undefined);

  const goToFilesPage = () => {
    navigate('../files');
  };

  useEffect(() => {
    setUpPage();
  }, []);

  useEffect(
    () => {
      if (!loadingDecisionRequest && decisionRequested) {
        goToFilesPage();
      }
    },
    [loadingDecisionRequest, decisionRequested],
  );

  const submit = () => {
    if (addedEvidence) {
      submit5103(params.id, params.trackedItemId, true);
    } else {
      setCheckboxErrorMessage(
        `You must confirm you’re done adding evidence before submitting the evidence waiver`,
      );
    }
  };
  const dateFormatter = buildDateFormatter();

  if (!TrackedItem.is5103Notice(item.displayName)) {
    return null;
  }

  const submitDisabled = loadingDecisionRequest || decisionRequestError;

  let buttonMsg = 'Submit evidence waiver';
  if (loadingDecisionRequest) {
    buttonMsg = 'Submitting evidence waiver...';
  } else if (decisionRequestError !== null) {
    buttonMsg = 'Something went wrong...';
  }

  return (
    <div id="default-5103-notice-page" className="vads-u-margin-bottom--3">
      <h1 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Review evidence list (5103 notice)
      </h1>
      {TrackedItem.isStandard5103Notice(item.displayName) ? (
        <p>
          We sent you a “List of evidence we may need (5103 notice)” letter.
          This letter lets you know about different types of additional evidence
          that could help your claim.
        </p>
      ) : (
        <p>
          On <strong>{dateFormatter(item.requestedDate)}</strong>, we sent you a
          “List of evidence we may need (5103 notice)” letter. This letter lets
          you know about different types of additional evidence that could help
          your claim.
        </p>
      )}
      <h2>Read your 5103 notice letter</h2>
      <p>
        You can read your “List of evidence we may need (5103 notice)” letter on
        the claim letters page.
      </p>
      <Link className="active-va-link" to="/your-claim-letters">
        Find this letter on the claim letters page
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </Link>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        Submit additional evidence, if applicable
      </h2>
      <p>
        If you’d like to submit additional evidence based on information in your
        “List of evidence we may need (5103 notice)” letter, you can submit that
        evidence here.
      </p>
      <Link
        className="active-va-link"
        data-testid="upload-evidence-link"
        to="../files#add-files"
      >
        Upload additional evidence
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </Link>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        Submit an evidence waiver
      </h2>
      <p>
        Submitting this waiver will let VA know that as of now, you’re done
        submitting additional evidence. This allows your claim to move into the
        review stage as quickly as possible.
      </p>
      <p>
        {' '}
        <strong>Note:</strong> You can add evidence to support your claim at any
        time. However, if you add evidence later, your claim will move back to
        this step, so we encourage you to add all your evidence now.
      </p>
      <VaCheckbox
        label="As of now, I’m finished adding evidence to support my claim"
        className="vads-u-margin-y--3"
        checked={addedEvidence}
        error={checkboxErrorMessage}
        required
        onVaChange={event => {
          setAddedEvidence(event.detail.checked);
        }}
      />
      <VaButton
        id="submit"
        disabled={submitDisabled}
        text={buttonMsg}
        onClick={submit}
      />

      {TrackedItem.isAutomated5103Notice(item.displayName) && (
        <p data-testid="due-date-information">
          <strong>Note:</strong> If you don’t submit the evidence waiver, we'll
          wait for you to add evidence until{' '}
          <strong>{dateFormatter(item.suspenseDate)}</strong>. Then we'll
          continue processing your claim.
        </p>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;

  return {
    decisionRequested: claimsState.claimAsk.decisionRequested,
    decisionRequestError: claimsState.claimAsk.decisionRequestError,
    loadingDecisionRequest: claimsState.claimAsk.loadingDecisionRequest,
  };
}

const mapDispatchToProps = {
  submit5103: submit5103Action,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Default5103EvidenceNotice),
);

Default5103EvidenceNotice.propTypes = {
  decisionRequestError: PropTypes.string,
  decisionRequested: PropTypes.bool,
  item: PropTypes.object,
  loadingDecisionRequest: PropTypes.bool,
  navigate: PropTypes.func,
  params: PropTypes.object,
  submit5103: PropTypes.func,
};

export { Default5103EvidenceNotice };
