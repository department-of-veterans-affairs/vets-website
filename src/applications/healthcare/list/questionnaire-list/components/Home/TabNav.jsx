import React from 'react';
import TabItem from './TabItem';

export default function TabNav() {
  return (
    <nav className="questionnaire-list-tabs-container">
      <ul className="va-tabs questionnaire-list-tabs" role="tablist">
        <TabItem tabPath={`/healthcare/list/todo`} id="toDo" text="To Do" />
        <TabItem
          tabPath={`/healthcare/list/completed`}
          id="completed"
          text="Completed"
        />
      </ul>
    </nav>
  );
}
