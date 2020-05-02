import React from 'react';
import { IndexLink } from 'react-router';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';

export default function TabItem({
  onNextTab,
  onPreviousTab,
  id,
  tabpath,
  title,
  isActive,
}) {
  function onKeyDown(e) {
    if (e.key === 'ArrowRight' && onNextTab) {
      onNextTab();
    } else if (e.key === 'ArrowLeft' && onPreviousTab) {
      onPreviousTab();
    } else if (e.key === 'ArrowDown') {
      focusElement(`#tabpanel${id}`);
    }
  }

  const tabClasses = classNames(
    'vaos-appts__tab',
    'vads-u-text-align--center',
    'vads-u-color--gray-dark',
  );

  return (
    <li role="presentation" className="vads-u-margin--0">
      <IndexLink
        id={`tab${id}`}
        aria-controls={isActive ? `tabpanel${id}` : null}
        aria-selected={isActive ? 'true' : 'false'}
        role="tab"
        className={tabClasses}
        tabIndex={isActive ? null : '-1'}
        onKeyDown={onKeyDown}
        activeClassName="vaos-appts__tab--current"
        to={tabpath}
      >
        {title}
      </IndexLink>
    </li>
  );
}
