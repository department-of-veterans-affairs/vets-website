import React from 'react';

export default function VideoVisitProvider({ providers }) {
  if (!providers?.length) {
    return null;
  }

  return (
    <>
      <h4 className="vaos-appts__block-label">You’ll be meeting with</h4>
      <div>{providers[0].display}</div>
    </>
  );
}
