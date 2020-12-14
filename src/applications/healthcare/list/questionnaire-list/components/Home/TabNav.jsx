import React from 'react';
import TabItem from './TabItem';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

import { todoPath, completedPath } from './routes';

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
          tabPath={todoPath}
          id="toDo"
          text="To do"
          isActive={!pathWithSlash.includes('completed')}
          onNextTab={() => {
            history.push(completedPath);
            focusElement('#tab_completed');
          }}
          onPreviousTab={() => {
            history.push(completedPath);
            focusElement('#tab_completed');
          }}
        />
        <TabItem
          tabPath={completedPath}
          id="completed"
          text="Completed"
          isActive={pathWithSlash.includes('completed')}
          onNextTab={() => {
            history.push(todoPath);
            focusElement('#tab_toDo');
          }}
          onPreviousTab={() => {
            history.push(todoPath);
            focusElement('#tab_toDo');
          }}
        />
      </ul>
    </nav>
  );
}
