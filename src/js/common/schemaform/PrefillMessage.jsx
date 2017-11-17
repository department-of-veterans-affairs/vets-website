import React from 'react';

export default function PrefillMessage(props) {
  return (
    <div className="usa-alert usa-alert-info no-background-image schemaform-prefill-message">
      {props.message}
    </div>
  );
}
