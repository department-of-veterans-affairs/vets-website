import React from 'react';
import { useSelector } from 'react-redux';

const DraftSavedInfo = () => {
  const getDateAndTime = timeStamp => {
    const today = new Date(timeStamp);
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = today.toLocaleString('en-US', { day: '2-digit' });
    const year = today
      .getFullYear()
      .toString()
      .substring(2);
    const time = today.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: `${month}/${day}/${year}`, time };
  };

  const { isSaving, lastSaveTime, saveError } = useSelector(
    state => state.sm.draftDetails,
  );

  if (isSaving) return <div className="last-save-time">Saving...</div>;
  if (saveError)
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
  if (lastSaveTime) {
    const { date, time } = getDateAndTime(lastSaveTime);
    return (
      <va-alert
        background-only
        class="last-save-time"
        full-width="false"
        show-icon
        status="success"
        visible="true"
      >
        <p className="vads-u-margin-y--0">
          {`You’re message has been saved. Last save at ${date} at ${time}`}
        </p>
      </va-alert>
    );
  }
  return '';
};

export default DraftSavedInfo;
