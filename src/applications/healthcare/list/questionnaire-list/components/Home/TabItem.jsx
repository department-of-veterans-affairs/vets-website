import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import classNames from 'classnames';

export default function TabItem(props) {
  const { id, text, onNextTab, onPreviousTab, tabPath, isActive } = props;

  const onKeyDown = useMemo(
    () => {
      return e => {
        if (e.key === 'ArrowRight' && onNextTab) {
          onNextTab();
        } else if (e.key === 'ArrowLeft' && onPreviousTab) {
          onPreviousTab();
        } else if (e.key === 'ArrowDown') {
          focusElement(`#tabpanel_${id}`);
        }
      };
    },
    [id, onNextTab, onPreviousTab],
  );

  const tabClasses = classNames(
    'questionnaire-list-tab',
    'vads-u-text-align--center',
    'vads-u-color--gray-dark',
  );

  return (
    <li role="presentation" className="">
      <NavLink
        id={`tab_${id}`}
        aria-controls={isActive ? `tabpanel_${id}` : null}
        aria-label={`${id.replace(/-/g, ' ')} questionnaires`}
        aria-selected={isActive ? 'true' : 'false'}
        role="tab"
        className={tabClasses}
        tabIndex={isActive ? null : '-1'}
        onKeyDown={onKeyDown}
        activeClassName="current"
        to={tabPath}
        exact
        isActive={() => isActive}
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
