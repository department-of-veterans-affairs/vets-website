import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import DeleteDraft from '../Draft/DeleteDraft';

const ComposeFormActionButtons = ({
  onSend,
  onSaveDraft,
  formPopulated,
  setDeleteButtonClicked,
  cannotReply,
  draftId,
  navigationError,
  setNavigationError,
  setUnsavedNavigationError,
  savedForm,
  messageBody,
  hideSendButton,
}) => {
  const mhvSecureMessagingBlockedTriageGroup1p0 = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingBlockedTriageGroup1p0
      ],
  );
  return (
    <div className="compose-form-actions vads-u-display--flex vads-u-flex--1">
      {mhvSecureMessagingBlockedTriageGroup1p0
        ? !cannotReply &&
          !hideSendButton && (
            <va-button
              text="Send"
              label="Send"
              id="send-button"
              class={`
                small-screen:vads-u-flex--1
                small-screen:vads-u-margin-bottom--0
                small-screen:vads-u-margin-right--1
                vads-u-margin-bottom--2
                vads-u-margin-right--0
                vads-u-margin-top--0
                vads-u-width--full
              `}
              data-testid="Send-Button"
              onClick={onSend}
            />
          )
        : !cannotReply && (
            <va-button
              text="Send"
              label="Send"
              id="send-button"
              class={`
                small-screen:vads-u-flex--1
                small-screen:vads-u-margin-bottom--0
                small-screen:vads-u-margin-right--1
                vads-u-margin-bottom--2
                vads-u-margin-right--0
                vads-u-margin-top--0
                vads-u-width--full
              `}
              data-testid="Send-Button"
              onClick={onSend}
            />
          )
      }

      {!cannotReply && (
        <button
          type="button"
          id="save-draft-button"
          className={`
            save-draft-button
            vads-u-width--full
            usa-button
            ${hideSendButton ? 'usa-button-primary' : 'usa-button-secondary'}
            vads-u-margin-bottom--2
            vads-u-margin-right--0
            vads-u-margin-top--0
            vads-u-padding-x--0p5
            xsmall-screen:vads-u-flex--1
            xsmall-screen:vads-u-margin-bottom--0
            xsmall-screen:vads-u-margin-right--1
          `}
          data-testid="Save-Draft-Button"
          onClick={e => onSaveDraft('manual', e)}
        >
          <i className="fas fa-save" aria-hidden="true" />
          Save draft
        </button>
      )}
      {/* UCD requested to keep button even when not saved as draft */}
      <DeleteDraft
        draftId={draftId}
        formPopulated={formPopulated}
        navigationError={navigationError}
        savedForm={savedForm}
        setNavigationError={setNavigationError}
        setUnsavedNavigationError={setUnsavedNavigationError}
        setDeleteButtonClicked={setDeleteButtonClicked}
        cannotReply={cannotReply}
        messageBody={messageBody}
      />
    </div>
  );
};

ComposeFormActionButtons.propTypes = {
  cannotReply: PropTypes.bool,
  draftId: PropTypes.number,
  formPopulated: PropTypes.bool,
  hideSaveDraftButton: PropTypes.bool,
  hideSendButton: PropTypes.bool,
  messageBody: PropTypes.string,
  navigationError: PropTypes.object,
  savedForm: PropTypes.bool,
  setDeleteButtonClicked: PropTypes.func,
  setNavigationError: PropTypes.func,
  setUnsavedNavigationError: PropTypes.func,
  onSaveDraft: PropTypes.func,
  onSend: PropTypes.func,
};

export default ComposeFormActionButtons;
