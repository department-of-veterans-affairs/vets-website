import React from 'react';

const h3Text = () => {
  return 'Community focus';
};

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>{h3Text()}</h3>
      <p>
        Is the school single-gender, a Historically Black college or university,
        or does it have a religious affiliation?
      </p>
    </>
  );
}
