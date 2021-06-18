import React from 'react';

export default function VideoVisitProvider({ providers, isPast }) {
  return (
    <>
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
        {!isPast ? 'You’ll be meeting with' : 'You met with'}
      </h2>
      <ul className="usa-unstyled-list">
        {providers.map((provider, index) => (
          <li key={index}>{provider.display}</li>
        ))}
      </ul>
    </>
  );
}
