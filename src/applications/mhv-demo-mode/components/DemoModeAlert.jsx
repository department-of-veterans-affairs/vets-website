import React from 'react';

export default function DemoModeAlert() {
  return (
    <>
      <va-alert status="error" visible>
        <h2 slot="headline">You’re viewing a demo</h2>
        <p>Demo mode. Not actual health information</p>
      </va-alert>
    </>
  );
}
