import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

export default function LoadingSection({
  isLoading,
  message,
  children,
  render,
}) {
  if (isLoading) return <LoadingIndicator message={message} />;
  return children || render();
}
