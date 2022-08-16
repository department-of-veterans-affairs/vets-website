import React from 'react';

export const dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

export const radioOptions = [
  { label: 'Option 1: PDF document (best for printing)', value: 'pdf' },
  {
    label:
      'Option 2: Text file (best for screen readers, screen enlargers, and refreshable Braille displays)',
    value: 'txt',
  },
];

export const radioOptionsAriaLabels = [
  'Option 1: P D F Document (best for printing)',
  'Option 2: Text File (best for screen readers, screen enlargers, and refreshable Braille displays)',
];

export const radioLabel = (
  <div>
    <h3>Choose your file format and download your document</h3>
    <p>
      We offer two file format options for this form. Choose the option that
      best meets your needs.
    </p>
  </div>
);

export const notFoundComponent = () => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h3 slot="headline">
        You don’t have a 1095-B tax form available right now
      </h3>
      <div>
        <p>
          If you recently enrolled in VA health care, you may not have a 1095-B
          form yet. We process 1095-B forms in early January each year, based on
          your enrollment in VA health care during the past year.
        </p>
        <p>
          If you think you should have a 1095-B form, call us at{' '}
          <a href="tel:+18772228387" aria-label="1 8 7 7 2 2 2 8 3 8 7">
            1-877-222-8387
          </a>{' '}
          (
          <a href="tel:711" aria-label="TTY. 7 1 1">
            TTY: 711
          </a>
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </va-alert>
  );
};
