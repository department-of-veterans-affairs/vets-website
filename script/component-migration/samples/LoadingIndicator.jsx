import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export function VarProp() {
  const message = 'Loading your stuff...';

  return <LoadingIndicator message={message} />;
}

export function InlineProp() {
  return <LoadingIndicator message="Loading..." label="test" />;
}

export function Multiline() {
  return (
    <div>
      <div>
        <div>
          <LoadingIndicator
            setFocus
            enableAnalytics
            message="Give us a few moments..."
            label="loading"
          />
        </div>
      </div>
    </div>
  );
}
