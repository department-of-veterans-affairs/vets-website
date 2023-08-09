import React from 'react';
import PropTypes from 'prop-types';
import DeleteDraft from '../Draft/DeleteDraft';

const ComposeFormActionButtons = ({
  onSend,
  onSaveDraft,
  cannotReply,
  draftId,
  setNavigationError,
}) => {
  return (
    <div className="compose-form-actions vads-u-display--flex vads-u-flex--1">
      {!cannotReply && (
        <va-button
          text="Send"
          label="Send"
          id="send-button"
          class={`vads-u-padding-x--0p5 vads-u-width--full vads-u-margin-bottom--2 
                      small-screen:vads-u-flex--1 vads-u-margin-top--0 vads-u-margin-right--0`}
          data-testid="Send-Button"
          onClick={onSend}
        />
      )}

      <button
        type="button"
        id="save-draft-button"
        className={`usa-button usa-button-secondary save-draft-button vads-u-width--full vads-u-margin-left--0p5
                          xsmall-screen:vads-u-flex--1 vads-u-margin-top--0 xsmall-screen:vads-u-margin-right--1 
                          vads-u-margin-right--0`}
        data-testid="Save-Draft-Button"
        onClick={e => onSaveDraft('manual', e)}
      >
        <i className="fas fa-save" aria-hidden="true" />
        Save draft
      </button>
      {/* UCD requested to keep button even when not saved as draft */}
      <DeleteDraft draftId={draftId} setNavigationError={setNavigationError} />
    </div>
  );
};

ComposeFormActionButtons.propTypes = {
  cannotReply: PropTypes.bool,
  draftId: PropTypes.number,
  setNavigationError: PropTypes.func,
  onSaveDraft: PropTypes.func,
  onSend: PropTypes.func,
};

export default ComposeFormActionButtons;
