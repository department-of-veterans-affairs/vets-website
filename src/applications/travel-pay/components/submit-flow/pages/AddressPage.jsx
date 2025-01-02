import React from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AddressPage = ({ pageIndex, setPageIndex }) => {
  const handlers = {
    onNext: e => {
      e.preventDefault();
      setPageIndex(pageIndex + 1);
    },
    onBack: e => {
      e.preventDefault();
      setPageIndex(pageIndex - 1);
    },
  };

  return (
    <div>
      <h1>Address page</h1>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={e => handlers.onNext(e)}
        onSecondaryClick={e => handlers.onBack(e)}
      />
    </div>
  );
};

export default AddressPage;
