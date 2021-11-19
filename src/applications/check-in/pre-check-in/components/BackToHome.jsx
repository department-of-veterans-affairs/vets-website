import React from 'react';

import environment from 'platform/utilities/environment';

function BackToHome() {
  if (!environment.isLocalhost()) {
    return <></>;
  } else {
    return (
      <div>
        <a href="/health-care/appointment-pre-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287">
          Start again
        </a>
      </div>
    );
  }
}

export default BackToHome;
