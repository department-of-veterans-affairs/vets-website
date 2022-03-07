import React from 'react';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import recordEvent from 'platform/monitoring/record-event';

export default function JumpLink({ label, toId }) {
  const jumpLinkClicked = event => {
    event.preventDefault();
    scrollTo(toId, getScrollOptions());
  };

  const handleClick = event => {
    jumpLinkClicked(event);
    recordEvent({
      event: 'nav-jumplink-click',
      'click-text': label,
    });
  };

  return (
    <a
      className="vads-u-display--flex vads-u-text-decoration--none"
      href={`#${toId}`}
      onClick={handleClick}
    >
      <i
        className="fas fa-arrow-down va-c-font-size--xs vads-u-margin-top--1 vads-u-margin-right--1"
        aria-hidden="true"
      />
      {label}
    </a>
  );
}
