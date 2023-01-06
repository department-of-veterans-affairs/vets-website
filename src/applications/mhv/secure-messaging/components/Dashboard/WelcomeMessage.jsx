import React from 'react';
import TextPlaceholder from '../shared/TextPlaceholder';

const WelcomeMessage = () => {
  return (
    <div className="welcome-message">
      <h2>Welcome to the updated messaging tool</h2>
      <TextPlaceholder />
      <TextPlaceholder />
    </div>
  );
};

export default WelcomeMessage;
