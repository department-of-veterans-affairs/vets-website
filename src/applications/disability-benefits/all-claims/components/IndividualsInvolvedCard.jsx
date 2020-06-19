import React from 'react';

export default function IndividualsInvolvedCard({ formData }) {
  const { name } = formData;
  let displayTitle;
  if (name.first || name.last) {
    displayTitle = `${name.first || ''} ${name.last || ''}`;
  } else {
    displayTitle = formData['view:serviceMember']
      ? 'Service member'
      : 'Civilian';
  }
  return <h3 className="vads-u-font-size--h5">{displayTitle}</h3>;
}
