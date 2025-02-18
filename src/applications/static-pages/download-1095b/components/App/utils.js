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

// VA content time formatting - should be lowercase with periods
export const formatTimeString = string => {
  if (string.includes('AM')) {
    return string.replace('AM', 'a.m.');
  }
  return string.replace('PM', 'p.m.');
};

export const phoneComponent = number => {
  return (
    <>
      <va-telephone contact={number} /> (
      <va-telephone contact={CONTACTS['711']} tty />)
    </>
  );
};

export const LastUpdatedComponent = props => {
  return (
    <p>
      <span className="vads-u-line-height--3 vads-u-display--block">
        <strong>Related to:</strong> Health care
      </span>
      <span className="vads-u-line-height--3 vads-u-display--block">
        <strong>Document last updated:</strong> {props.lastUpdated}
      </span>
    </p>
  );
};

export const notFoundComponent = () => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h4 id="track-your-status-on-mobile" slot="headline">
        You don’t have a 1095-B tax form available right now
      </h4>
      <p className="vads-u-margin-y--0">
        You do not have a 1095-B tax form available. This could be because you
        weren’t enrolled in VA healthcare in 2024. If you think you were
        enrolled, call us at 877-222-8387 (TTY:711). We’re here Monday through
        Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );
};

export const unavailableComponent = () => {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2 slot="headline">
        Your 1095-B form isn’t available to download right now
      </h2>
      <div>
        <p>
          Check back later. Or, if you need help with this form now, call us at{' '}
          {phoneComponent(CONTACTS['222_VETS'])}. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </div>
    </va-alert>
  );
};
