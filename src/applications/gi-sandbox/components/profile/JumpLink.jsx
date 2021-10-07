import React from 'react';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

export default function JumpLink({ label, jumpToId }) {
  const jumpLinkClicked = e => {
    e.preventDefault();
    scrollTo(jumpToId, getScrollOptions());
  };

  return (
    <a
      className="jump-link arrow-down-link"
      href={`#${jumpToId}`}
      onClick={jumpLinkClicked}
    >
      <p>
        <i className={`fa fa-arrow-down`} aria-hidden="true" />
        <span>{label}</span>
      </p>
    </a>
  );
}
