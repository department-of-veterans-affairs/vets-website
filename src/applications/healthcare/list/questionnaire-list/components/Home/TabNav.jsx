import React from 'react';
import TabItem from './TabItem';

export default function TabNav() {
  return (
    <>
      <ul role="tablist">
        <TabItem tabPath={`/healthcare/list/todo`} id="toDo" text="To Do" />
        <TabItem
          tabPath={`/healthcare/list/completed`}
          id="completed"
          text="Completed"
        />
      </ul>
    </>
  );
}
