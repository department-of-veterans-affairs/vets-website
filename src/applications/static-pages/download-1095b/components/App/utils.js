import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library';

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

export const phoneComponent = number => {
  return (
    <>
      <va-telephone contact={number} /> (
      <va-telephone contact={CONTACTS['711']} tty />)
    </>
  );
};

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
          {phoneComponent(CONTACTS['222_VETS'])}. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </va-alert>
  );
};

export const unavailableComponent = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h3 slot="headline">1095-B download unavailable at this time</h3>
      <div>
        <p>
          Please check back later or if you need immediate assistance with this
          tax form, call the Enrollment Center at{' '}
          {phoneComponent(CONTACTS['222_VETS'])}. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </va-alert>
  );
};
