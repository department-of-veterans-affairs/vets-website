import React from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MileagePage = ({ handlers }) => {
  return (
    <div>
      <h1>Mileage page</h1>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default MileagePage;
