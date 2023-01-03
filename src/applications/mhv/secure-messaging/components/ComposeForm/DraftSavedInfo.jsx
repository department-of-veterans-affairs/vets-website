import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat } from '../../util/helpers';

const DraftSavedInfo = props => {
  const { userSaved } = props;

  const { isSaving, lastSaveTime, saveError } = useSelector(
    state => state.sm.draftDetails,
  );

  const content = () => {
    if (isSaving) return 'Saving...';
    if (lastSaveTime) {
      return `Your message has been saved. Last save on ${dateFormat(
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
          Something went wrong... Failed to save message.
        </p>
      </va-alert>
    );
  }
  if (lastSaveTime) {
    return (
      <>
        <va-alert
          background-only
          class="last-save-time"
          full-width="false"
          show-icon
          status="success"
          visible={userSaved}
        >
          <p className="vads-u-margin-y--0">{content()}</p>
        </va-alert>
        {userSaved === false && <p>{content()}</p>}
      </>
    );
  }
  return '';
};

DraftSavedInfo.propTypes = {
  userSaved: PropTypes.bool,
};

export default DraftSavedInfo;
