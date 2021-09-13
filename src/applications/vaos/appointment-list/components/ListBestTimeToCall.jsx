import React from 'react';

export default function ListBestTimeToCall({ timesToCall }) {
  const times = timesToCall?.map(t => t.toLowerCase());
  if (times?.length === 1) {
    return <>Call {times[0]}</>;
  } else if (times?.length === 2) {
    return (
      <>
        Call {times[0]} or {times[1]}
      </>
    );
  } else if (times?.length === 3) {
    return (
      <>
        Call {times[0]}, {times[1]}, or {times[2]}
      </>
    );
  }

  return null;
}
