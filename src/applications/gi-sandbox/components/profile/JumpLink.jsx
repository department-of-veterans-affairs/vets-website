import React from 'react';

export default function JumpLink({ label, jumpToId }) {
  return (
    <a className="jump-link arrow-down-link" href={`#${jumpToId}`}>
      <p>
        <i className={`fa fa-arrow-down`} aria-hidden="true" />
        <span>{label}</span>
      </p>
    </a>
  );
}
