import React from 'react';

export default function EmptyMessage({ message }) {
  return (
    <section data-testid="empty-message" className="empty-message">
      <p>{message}</p>
    </section>
  );
}
