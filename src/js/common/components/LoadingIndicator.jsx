import React from 'react';

export default function LoadingIndicator({ message }) {
  return (
    <div className="loading-indicator-container">
      <div className="loading-indicator"></div>
      {message}
    </div>
  );
}
