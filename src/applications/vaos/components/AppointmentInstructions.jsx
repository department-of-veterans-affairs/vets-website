import React from 'react';

export default function AppointmentInstructions({ instructions }) {
  if (!instructions) {
    return null;
  }
  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      <dl className="vads-u-margin--0">
        <dt className="vads-u-font-weight--bold">{instructions.header}</dt>
        <dd>{instructions.body}</dd>
      </dl>
    </div>
  );
}
