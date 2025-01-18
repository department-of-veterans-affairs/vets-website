import React from 'react';
import { useAuth } from '../context/AuthContext';

const ActiveAccountBanner = ({ onEndSession }) => {
  const { userData, original, setIsModalVisible } = useAuth();

  return (
    <va-alert-expandable
      status="warning"
      trigger="You are currently using a production test account."
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        zIndex: '1000',
        padding: '8px 16px',
        display: 'flex',
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
        <p style={{ margin: '0', color: '#333', fontSize: '14px' }}>
          Welcome, {original}! You are logged in as{' '}
          {userData?.user?.name || 'User'} with a production test account. You
          can continue as this user or switch to a different account.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIsModalVisible(true)}
          style={{ marginRight: '0.5em' }}
          className="va-button-link"
        >
          Change User
        </button>
        <button onClick={onEndSession} className="va-button-link">
          End Session
        </button>
      </div>
    </va-alert-expandable>
  );
};

export default ActiveAccountBanner;
