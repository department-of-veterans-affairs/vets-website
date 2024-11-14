import React from 'react';

const Breadcrumbs = ({
  step,
  onHomeClick,
  onProfileClick,
  onPersonalInfoClick,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <button
        slot="link-1"
        onClick={onHomeClick}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: step === 'signIn' ? 'bold' : 'normal',
        }}
      >
        VA.gov Home
      </button>
      {step !== 'signIn' && (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {'   '}
          <span style={{ marginRight: '8px' }}>&gt;</span>
          {'   '}
          <button
            slot="link-2"
            onClick={onProfileClick}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: step === 'profile' ? 'bold' : 'normal',
            }}
          >
            Profile
          </button>
        </span>
      )}
      {step === 'personalInformation' && (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <span style={{ marginRight: '8px' }}>&gt;</span>

          <button
            slot="link-3"
            onClick={onPersonalInfoClick}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Personal Information
          </button>
        </span>
      )}
    </div>
  );
};

export default Breadcrumbs;
