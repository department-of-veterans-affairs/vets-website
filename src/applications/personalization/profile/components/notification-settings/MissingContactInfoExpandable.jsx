import React from 'react';

export const MissingContactInfoExpandable = () => {
  return (
    <va-alert-expandable
      status="info"
      trigger="Want to manage you email notification settings?"
    >
      <div>
        <p>
          Add your email address to your profile to manage these email
          notification settings:
        </p>
        <ul>
          <li>Prescription refill</li>
          <li>Secure message</li>
          <li>VA appointment</li>
          <li>VA health care appointment</li>
          <li>VA payment</li>
          <li>VA prescription</li>
          <li>VA test and lab results</li>
        </ul>

        <a href="/profile">Add your email address your profile</a>
      </div>
    </va-alert-expandable>
  );
};
