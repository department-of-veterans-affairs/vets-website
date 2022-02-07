import React from 'react';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import recordEvent from 'platform/monitoring/record-event';

export default function JumpLink({ label, jumpToId }) {
  const jumpLinkClicked = e => {
    e.preventDefault();
    scrollTo(jumpToId, getScrollOptions());
  };

  const handleClick = e => {
    jumpLinkClicked(e);
    recordEvent({
      event: 'nav-jumplink-click',
      'click-text': label,
    });
  };

  return (
    <a
      className="jump-link arrow-down-link"
      href={`#${jumpToId}`}
      onClick={handleClick}
    >
      <p>
        <i className={`fa fa-arrow-down`} aria-hidden="true" />
        <span>{label}</span>
      </p>
    </a>
  );
}
