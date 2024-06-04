import React from 'react';

export default function IconWithInfo({ icon, children, present, variant }) {
  if (!present) return null;

  return (
    <>
      {variant === 'fontawesome' ? (
        <p className="icon-with-info">
          <i
            className={`fa fa-${icon}`}
            style={{ marginLeft: '5px' }}
            aria-hidden="true"
          />
          &nbsp;
          {children}
        </p>
      ) : (
        <p className="icon-with-info">
          <va-icon icon={icon} size={3} aria-hidden="true" />
          &nbsp;
          {children}
        </p>
      )}
    </>
  );
}
