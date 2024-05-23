import React from 'react';

const h3Text = () => {
  return 'Community focus';
};

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>{h3Text()}</h3>
      <p>
        Community focus indicates colleges or other institutions of higher
        learning that support one or more specific communities (e.g., support
        for a specified race, ethnicity, or religious affiliation).
      </p>
    </>
  );
}
