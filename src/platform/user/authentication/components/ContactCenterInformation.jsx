import React from 'react';
import HelpdeskInfo from 'platform/static-data/SubmitSignInForm';

export default function ContactCenterInformation({
  startSentence,
  className = '',
  children = '',
}) {
  return (
    <p className={className}>
      {children} <HelpdeskInfo startSentence={startSentence} />
    </p>
  );
}
