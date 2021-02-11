import React from 'react';

export default function AppointmentInstructions({
  instructions,
  isHomepageRefresh,
}) {
  if (!instructions) {
    return null;
  }

  const [header, body] = instructions.split(': ', 2);

  return (
    <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
      {isHomepageRefresh && (
        <h2 className="vaos-appts__block-label vads-u-font-size--h5">
          {header}
        </h2>
      )}
      {!isHomepageRefresh && (
        <h4 className="vaos-appts__block-label">{header}</h4>
      )}
      <div>{body}</div>
    </div>
  );
}
