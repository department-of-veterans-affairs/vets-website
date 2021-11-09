import React from 'react';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';

function BackToHome() {
  return (
    <div>
      <a href="/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287">
        Check in again
      </a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
