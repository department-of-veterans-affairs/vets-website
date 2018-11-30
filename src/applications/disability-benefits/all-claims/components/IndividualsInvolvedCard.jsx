import React from 'react';

export default function IndividualsInvolvedCard({ formData }) {
  const { name } = formData;
  const serviceMemberTitle = formData['view:serviceMember']
    ? 'Servicemember'
    : 'Civilian';
  const displayTitle =
    name.first || name.last
      ? `${name.first || ''} ${name.last || ''}`
      : serviceMemberTitle;
  return <h5>{displayTitle}</h5>;
}
