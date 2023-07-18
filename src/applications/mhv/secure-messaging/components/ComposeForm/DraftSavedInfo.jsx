import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat } from '../../util/helpers';

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
    if (lastSaveTime) {
      return `Your message was saved on ${dateFormat(
        lastSaveTime,
        'MMMM D, YYYY [at] h:mm a z',
      )}.`;
    }
    return '';
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
          {`${saveError.title}... ${saveError.detail}.`}
        </p>
      </va-alert>
    );
  }
  if (lastSaveTime) {
    return (
      <>
        <va-alert
          aria-live="polite"
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
        {userSaved === false && (
          <va-alert
            aria-live={ariaLive}
            background-only
            class="last-save-time"
            full-width="false"
            show-icon
            status="success"
            visible
          >
            <p className="vads-u-margin-y--0">{content()}</p>
          </va-alert>
        )}
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
