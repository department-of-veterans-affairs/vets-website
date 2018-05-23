import React from 'react';

export default function PersonalizationBanner({ dismiss }) {
  return (
    <div className="personalization-announcement">
      <a onClick={dismiss} href="/dashboard">Check out your new personalized homepage</a>
      <button type="button" onClick={dismiss} className="va-modal-close">
        <i className="fa fa-close"/>
      </button>
    </div>
  );
}
