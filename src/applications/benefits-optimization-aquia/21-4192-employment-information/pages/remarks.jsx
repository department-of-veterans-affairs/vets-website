import React from 'react';

/**
 * Remarks page component for VA Form 21-4192
 * @module pages/remarks
 */
const RemarksPage = () => {
  return (
    <div className="vads-u-margin-y--4">
      <va-alert status="info" visible>
        <h2 slot="headline">Under Development</h2>
        <p>
          This page is currently under development. Please check back later for
          updates.
        </p>
      </va-alert>
    </div>
  );
};

export default RemarksPage;
