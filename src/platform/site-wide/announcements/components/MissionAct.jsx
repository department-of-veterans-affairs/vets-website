import React from 'react';

export default function MissionAct({ dismiss }) {
  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span>{' '}
      <a onClick={dismiss} href="https://missionact.va.gov/">
        Learn how you can get easier access to health care with the MISSION Act.
      </a>
      <button
        type="button"
        aria-label="Dismiss this announcement"
        onClick={dismiss}
        className="va-modal-close"
      >
        <i className="fas fa-times-circle" />
      </button>
    </div>
  );
}
