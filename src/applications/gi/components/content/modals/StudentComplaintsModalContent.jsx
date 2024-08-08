import React from 'react';

export default function StudentComplaintsModalContent() {
  return (
    <div>
      <p>
        This is the number of closed, Principles of Excellence-related,
        complaints submitted to VA through the GI Bill Feedback system for this
        school.
      </p>
      <p>
        To learn more{' '}
        <a
          href="https://www.benefits.va.gov/GIBILL/Feedback.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          visit the VA GI Bill Feedback Tool
        </a>
        .
      </p>
    </div>
  );
}
