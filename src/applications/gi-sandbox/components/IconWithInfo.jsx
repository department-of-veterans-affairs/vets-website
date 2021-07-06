import React from 'react';

export default function IconWithInfo({ icon, children, present }) {
  if (!present) return null;
  return (
    <p className="icon-with-info">
      <i className={`fa fa-${icon}`} aria-hidden="true" />
      &nbsp;
      {children}
    </p>
  );
}
