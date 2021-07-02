import React from 'react';

import withNotOnProduction from '../containers/withNotOnProduction';

function BackToHome() {
  return (
    <div>
      <a href="/check-in/abc-1234">Check in again</a>
    </div>
  );
}

export default withNotOnProduction(BackToHome);
