import React from 'react';
import { useFormikContext } from 'formik';

/**
 * Display the Formik state
 */
const DebuggerView = () => {
  const state = useFormikContext();
  return (
    <>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </>
  );
};

export default DebuggerView;
