import React from 'react';

export default function ProfileSection({ children, id, label }) {
  return (
    <div className="profile-section" id={id}>
      <h2 className="small-screen-header">{label}</h2>
      <div className="section-body">{children}</div>
    </div>
  );
}
