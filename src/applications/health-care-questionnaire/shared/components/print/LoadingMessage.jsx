import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export default function LoadingMessage() {
  return (
    <>
      <section className="loading-message" data-testid="loader-container">
        <LoadingIndicator />
        <p id="loading-message" tabIndex="-1" aria-live="assertive">
          We're creating a PDF of your completed questionnaire. Please don't
          refresh your browser.
        </p>
        <p>When your PDF is ready, it will open in a new browser tab.</p>
      </section>
      <button
        className={'usa-button va-button view-and-print-button'}
        disabled
        data-testid="print-button"
        aria-label={`Creating your PDF`}
      >
        Creating PDF...
      </button>
    </>
  );
}
