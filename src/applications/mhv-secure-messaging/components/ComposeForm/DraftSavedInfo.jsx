import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { ErrorMessages } from '../../util/constants';

const DraftSavedInfo = props => {
  const { messageId, drafts } = props;

  const threadDetails = useSelector(state => state.sm.threadDetails);

  const { isSaving = null, saveError = null, lastSaveTime = null } = useMemo(
    () => {
      const draft = messageId
        ? drafts?.find(d => d.messageId === messageId)
        : null;

      if (drafts?.length > 1) {
        return {
          isSaving: draft?.isSaving,
          saveError: draft?.saveError,
          lastSaveTime: draft?.lastSaveTime,
        };
      }
      return threadDetails;
    },
    [drafts, messageId, threadDetails],
  );

  const content = useMemo(
    () => {
      if (isSaving) return 'Saving...';

      if (lastSaveTime) {
        return `Your message was saved on ${dateFormat(
          lastSaveTime,
          'MMMM D, YYYY [at] h:mm a z',
        )}.`;
      }
      return '';
    },
    [isSaving, lastSaveTime],
  );

  if (saveError) {
    return (
      <va-alert
        background-only
        class="last-save-time"
        full-width="false"
        show-icon
        status="error"
        visible="true"
      >
        <p className="vads-u-margin-y--0">
          {ErrorMessages.ComposeForm.UNABLE_TO_SAVE_OTHER}
        </p>
      </va-alert>
    );
  }
  if (isSaving || lastSaveTime) {
    return (
      <>
        <va-alert
          aria-live="polite"
          background-only
          class="last-save-time"
          full-width="false"
          show-icon
          status="success"
          visible
          aria-describedby="save-draft-button"
          data-test-id="save-alert-message"
        >
          <p className="vads-u-margin-y--0" id="messagetext">
            {content}
          </p>
        </va-alert>
      </>
    );
  }
  return '';
};

DraftSavedInfo.propTypes = {
  drafts: PropTypes.array,
  messageId: PropTypes.number,
};

export default DraftSavedInfo;
