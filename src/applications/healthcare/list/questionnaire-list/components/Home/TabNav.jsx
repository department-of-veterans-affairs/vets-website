import React from 'react';
import TabItem from './TabItem';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

export default function TabNav() {
  const history = useHistory();
  const location = useLocation();

  const pathWithSlash = location.pathname.endsWith('/')
    ? location.pathname
    : `${location.pathname}/`;

  return (
    <nav className="questionnaire-list-tabs-container">
      <ul className="va-tabs questionnaire-list-tabs" role="tablist">
        <TabItem
          tabPath={`/healthcare/list/todo`}
          id="toDo"
          text="To Do"
          isActive={!pathWithSlash.includes('completed')}
          onNextTab={() => {
            history.push('/healthcare/list/completed');
            focusElement('#tab_completed');
          }}
          onPreviousTab={() => {
            history.push('/healthcare/list/completed');
            focusElement('#tab_completed');
          }}
        />
        <TabItem
          tabPath={`/healthcare/list/completed`}
          id="completed"
          text="Completed"
          isActive={pathWithSlash.includes('completed')}
          onNextTab={() => {
            history.push('/healthcare/list/todo');
            focusElement('#tab_toDo');
          }}
          onPreviousTab={() => {
            history.push('/healthcare/list/todo');
            focusElement('#tab_toDo');
          }}
        />
      </ul>
    </nav>
  );
}
