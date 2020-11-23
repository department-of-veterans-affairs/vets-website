import React from 'react';
import { NavLink } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

export default function TabItem(props) {
  const { id, text, onNextTab, onPreviousTab, tabPath, isActive } = props;

  // TODO use Memo?
  const onKeyDown = e => {
    if (e.key === 'ArrowRight' && onNextTab) {
      onNextTab();
    } else if (e.key === 'ArrowLeft' && onPreviousTab) {
      onPreviousTab();
    } else if (e.key === 'ArrowDown') {
      focusElement(`#tabpanel${id}`);
    }
  };

  return (
    <li role="presentation">
      <NavLink
        id={`tab_${id}`}
        aria-controls={isActive ? `tabpanel${id}` : null}
        aria-label={`${id.replace(/-/g, ' ')} appointments`}
        aria-selected={isActive ? 'true' : 'false'}
        role="tab"
        className={''}
        tabIndex={isActive ? null : '-1'}
        onKeyDown={onKeyDown}
        activeClassName=""
        to={tabPath}
        exact
        onClick={() => {
          recordEvent({
            event: 'questionnaire-nav-tab-click',
            'tab-text': text,
          });
        }}
      >
        {text}
      </NavLink>
    </li>
  );
}
