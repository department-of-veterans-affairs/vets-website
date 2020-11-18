import React from 'react';
import TabItem from './TabItem';
import { useLocation } from 'react-router-dom';

export default function TabNav() {
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
        />
        <TabItem
          tabPath={`/healthcare/list/completed`}
          id="completed"
          text="Completed"
          isActive={pathWithSlash.includes('completed')}
        />
      </ul>
    </nav>
  );
}
