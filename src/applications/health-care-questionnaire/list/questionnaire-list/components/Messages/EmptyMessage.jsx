import React from 'react';

export default function EmptyMessage() {
  return (
    <section data-testid="empty-message" className="empty-message">
      <p>
        Your health care providers haven’t sent any questionnaires to you yet.
      </p>
    </section>
  );
}
