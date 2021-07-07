import React from 'react';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';

function BackToHome() {
  return (
    <div>
      <a href="/health-care/appointment-check-in/?id=abc-123">Check in again</a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
