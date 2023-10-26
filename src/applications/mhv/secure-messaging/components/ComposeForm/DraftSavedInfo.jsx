import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat } from '../../util/helpers';
import { ErrorMessages } from '../../util/constants';

const DraftSavedInfo = props => {
  const { userSaved, attachments } = props;

  const { isSaving, lastSaveTime, saveError } = useSelector(
    state => state.sm.draftDetails,
  );
  const [ariaLive, setAriaLive] = useState('off');

  useEffect(
    () => {
      setAriaLive(
        attachments === undefined || attachments.length > 0 ? 'off' : 'polite',
      );
    },
    [attachments],
  );

  const content = () => {
    if (isSaving) return 'Saving...';

    return `Your message was saved on ${dateFormat(
      lastSaveTime,
      'MMMM D, YYYY [at] h:mm a z',
    )}.`;
  };

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
  if (lastSaveTime) {
    return (
      <>
        <va-alert
          aria-live={!userSaved ? ariaLive : 'polite'}
          background-only
          class="last-save-time"
          full-width="false"
          show-icon
          status="success"
          visible={userSaved}
          aria-describedby="save-draft-button"
        >
          <p className="vads-u-margin-y--0">{content()}</p>
        </va-alert>
      </>
    );
  }
  return '';
};

DraftSavedInfo.propTypes = {
  attachments: PropTypes.array,
  userSaved: PropTypes.bool,
};

export default DraftSavedInfo;
