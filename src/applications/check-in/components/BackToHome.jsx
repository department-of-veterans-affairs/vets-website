import React from 'react';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';

function BackToHome() {
  return (
    <div>
      <a href="/check-in/abc-1234">Check in again</a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
