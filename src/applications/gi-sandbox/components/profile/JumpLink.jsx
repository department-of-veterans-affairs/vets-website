import React from 'react';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

export default function JumpLink({ label, jumpToId }) {
  const jumpLinkClicked = e => {
    e.preventDefault();
    scroller.scrollTo(jumpToId, getScrollOptions());
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
