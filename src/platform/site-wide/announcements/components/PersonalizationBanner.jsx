import React from 'react';

export default function PersonalizationBanner({ dismiss }) {
  return (
    <div className="personalization-announcement">
      <a href="/dashboard">Check out your new personalized homepage</a>
      <button onClick={dismiss}>Dismiss this baby</button>
    </div>
  );
}
