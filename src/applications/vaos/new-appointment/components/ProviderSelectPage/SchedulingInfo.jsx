import React from 'react';

export default function SchedulingInfo() {
  return (
    <>
      <va-additional-info trigger="Why you can’t schedule online">
        <p>
          Your last appointment with this provider was more than
          [relationshipAge value] months ago. You can only schedule online if
          you've had an appointment in the past [relationshipAge value] months.
        </p>
      </va-additional-info>
    </>
  );
}
