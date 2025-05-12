import React, { useEffect } from 'react';
import { useStore } from 'react-redux';

import repStatusLoader from 'platform/user/widgets/representative-status';

const AccreditedRepresentative = () => {
  const store = useStore();

  useEffect(() => {
    repStatusLoader(store, 'representative-status', 3);
  }, []);

  return (
    <>
      <h1
        tabIndex="-1"
        className="vads-u-font-size--h2 vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Accredited Representative or VSO
      </h1>

      <div data-widget-type="representative-status" />
    </>
  );
};

export default AccreditedRepresentative;
