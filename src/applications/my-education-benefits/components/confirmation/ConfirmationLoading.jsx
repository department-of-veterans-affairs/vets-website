import React from 'react';

export default function ConfirmationLoading() {
  return (
    <div
      className="meb-confirmation-page meb-confirmation-page_loading"
      style={{ marginBottom: '3rem' }}
    >
      <va-loading-indicator
        label="Loading"
        message="Loading your results"
        set-focus
      />
    </div>
  );
}
