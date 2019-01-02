import React from 'react';

import PreferenceItem from './PreferenceItem';

export default function PreferenceList({
  benefits,
  handleViewToggle,
  handleRemove,
  view,
}) {
  return (
    <div>
      {benefits.map((benefit, index) => (
        <PreferenceItem
          key={index}
          benefit={benefit}
          isRemoving={!!view[benefit.code]}
          handleViewToggle={handleViewToggle}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
}
