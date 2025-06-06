import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { getScrollOptions, scrollTo } from 'platform/utilities/scroll';
import recordEvent from 'platform/monitoring/record-event';
import { isProductionOrTestProdEnv } from '../../utils/helpers';

export default function JumpLink({
  label,
  jumpToId,
  iconToggle = true,
  onClick,
  dataTestId,
  customClass,
}) {
  const jumpLinkClicked = e => {
    e?.preventDefault();
    scrollTo(jumpToId, getScrollOptions());
    const sectionHeading = document.querySelector(`#${jumpToId} h2`);
    focusElement(sectionHeading);
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

  if (!isProductionOrTestProdEnv()) {
    return (
      <a
        className="jump-link arrow-down-link"
        href={`#${jumpToId}`}
        onClick={handleClick}
      >
        <p>
          {iconToggle && (
            <va-icon
              icon="arrow_downward"
              aria-hidden="true"
              class="iconToggle"
            />
          )}
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
          <va-icon
            icon="arrow_downward"
            aria-hidden="true"
            class="iconToggle"
          />
        )}
        {label}
      </p>
    </a>
  );
}
JumpLink.propTypes = {
  jumpToId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  dataTestId: PropTypes.string,
  iconToggle: PropTypes.bool,
  onClick: PropTypes.func,
};
