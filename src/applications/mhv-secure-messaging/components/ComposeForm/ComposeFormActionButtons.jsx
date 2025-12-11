import React from 'react';
import PropTypes from 'prop-types';
import DeleteDraft from '../Draft/DeleteDraft';

const ComposeFormActionButtons = props => {
  const {
    onSend,
    onSaveDraft,
    formPopulated,
    cannotReply,
    draftBody,
    draftId,
    draftsCount,
    navigationError,
    refreshThreadCallback,
    setNavigationError,
    setUnsavedNavigationError,
    messageBody,
    draftSequence,
    setHideDraft,
    setIsEditing,
    savedComposeDraft,
    redirectPath,
  } = props;

  return (
    <div className="compose-form-actions vads-u-display--flex vads-u-flex--1">
      {!cannotReply && (
        <va-button
          text={`Send${draftSequence ? ` draft ${draftSequence}` : ''}`}
          id={`send-button${draftSequence ? `-${draftSequence}` : ''}`}
          class={`
            mobile-lg:vads-u-flex--1
            mobile-lg:vads-u-margin-bottom--0
            mobile-lg:vads-u-margin-right--1
            vads-u-margin-bottom--2
            vads-u-margin-right--0
            vads-u-margin-top--0
            vads-u-width--full
          `}
          data-testid={`send-button${draftSequence ? `-${draftSequence}` : ''}`}
          data-dd-action-name="Send Button"
          onClick={onSend}
        />
      )}
      {!cannotReply && (
        <button
          type="button"
          id={`save-draft-button${draftSequence ? `-${draftSequence}` : ''}`}
          className={`
            save-draft-button
            usa-button
            usa-button-secondary
            vads-u-margin-bottom--2
            vads-u-margin-right--0
            vads-u-margin-top--0
            vads-u-padding-x--0p5
            vads-u-width--full
            mobile:vads-u-flex--1
            mobile:vads-u-margin-bottom--0
            mobile:vads-u-margin-right--1
          `}
          data-testid={`save-draft-button${
            draftSequence ? `-${draftSequence}` : ''
          }`}
          onClick={e => onSaveDraft('manual', e)}
        >
          Save draft {draftSequence}
        </button>
      )}
      {/* UCD requested to keep button even when not saved as draft */}
      <DeleteDraft
        draftId={draftId}
        draftsCount={draftsCount}
        draftBody={draftBody}
        formPopulated={formPopulated}
        navigationError={navigationError}
        refreshThreadCallback={refreshThreadCallback}
        setNavigationError={setNavigationError}
        setUnsavedNavigationError={setUnsavedNavigationError}
        cannotReply={cannotReply}
        messageBody={messageBody}
        draftSequence={draftSequence}
        setHideDraft={setHideDraft}
        setIsEditing={setIsEditing}
        savedComposeDraft={savedComposeDraft}
        redirectPath={redirectPath}
      />
    </div>
  );
};

ComposeFormActionButtons.propTypes = {
  cannotReply: PropTypes.bool,
  draftBody: PropTypes.string,
  draftId: PropTypes.number,
  draftSequence: PropTypes.number,
  draftsCount: PropTypes.number,
  formPopulated: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  messageBody: PropTypes.string,
  navigationError: PropTypes.object,
  redirectPath: PropTypes.string,
  refreshThreadCallback: PropTypes.func,
  savedComposeDraft: PropTypes.bool,
  savedForm: PropTypes.bool,
  setHideDraft: PropTypes.func,
  setIsEditing: PropTypes.func,
  setIsModalVisible: PropTypes.func,
  setNavigationError: PropTypes.func,
  setUnsavedNavigationError: PropTypes.func,
  onSaveDraft: PropTypes.func,
  onSend: PropTypes.func,
};

export default ComposeFormActionButtons;
