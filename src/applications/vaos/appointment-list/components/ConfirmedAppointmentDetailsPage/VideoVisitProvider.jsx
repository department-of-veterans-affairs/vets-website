import React from 'react';

export default function VideoVisitProvider({ providers }) {
  if (!providers?.length) {
    return null;
  }

  return (
    <>
      <h3 className="vaos-appts__block-label">You’ll be meeting with</h3>
      <div>{providers[0].display}</div>
    </>
  );
}
