import React from 'react';

export default function ProfileNotUpdatedNote(includePrefix = true) {
  return (
    <p>
      {includePrefix && <strong>Note: </strong>} This is the information we have
      in your VA.gov profile. Any changes you make on this screen will only
      affect this application.
    </p>
  );
}
