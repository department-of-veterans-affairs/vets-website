import React from 'react';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import recordEvent from 'platform/monitoring/record-event';
import { isProductionOfTestProdEnv } from '../../utils/helpers';

export default function JumpLink({
  label,
  jumpToId,
  iconToggle = true,
  onClick,
  dataTestId,
  customClass,
}) {
  const jumpLinkClicked = e => {
    e.preventDefault();
    scrollTo(jumpToId, getScrollOptions());
  };

  const handleClick = e => {
    if (onClick) {
      onClick();
    }
    jumpLinkClicked(e);
    recordEvent({
      event: 'nav-jumplink-click',
      'click-text': label,
    });
  };

  if (isProductionOfTestProdEnv()) {
    return (
      <a
        className="jump-link arrow-down-link"
        href={`#${jumpToId}`}
        onClick={handleClick}
      >
        <p>
          {iconToggle && <i className="fa fa-arrow-down" aria-hidden="true" />}
          <span>{label}</span>
        </p>
      </a>
    );
  }

  return (
    <a
      className={`jump-link ${customClass || 'arrow-down-link'}`}
      href={`#${jumpToId}`}
      onClick={handleClick}
      tabIndex={0}
      data-testid={dataTestId}
    >
      <p className={customClass && 'filter-before-res-link'}>
        {iconToggle && (
          <i className="fa fa-arrow-down iconToggle" aria-hidden="true" />
        )}
        {label}
      </p>
    </a>
  );
}
