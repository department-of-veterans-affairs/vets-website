import React from 'react';
import { useFormikContext } from 'formik';

/**
 * Display the Formik state
 */
const DebuggerView = () => {
  const { values } = useFormikContext();
  return (
    <>
      <pre>
        <code>{JSON.stringify(values, null, 2)}</code>
      </pre>
    </>
  );
};

export default DebuggerView;
