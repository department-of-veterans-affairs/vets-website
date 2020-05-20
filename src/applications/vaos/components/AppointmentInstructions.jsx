import React from 'react';
import { PURPOSE_TEXT } from '../utils/constants';

export default function AppointmentInstructions({ instructions }) {
  if (
    !instructions ||
    !PURPOSE_TEXT.some(purpose => instructions.startsWith(purpose.short))
  ) {
    return null;
  }

  const [header, body] = instructions.split(': ', 2);

  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      <dl className="vads-u-margin--0">
        <dt className="vads-u-font-weight--bold">{header}</dt>
        <dd>{body}</dd>
      </dl>
    </div>
  );
}
