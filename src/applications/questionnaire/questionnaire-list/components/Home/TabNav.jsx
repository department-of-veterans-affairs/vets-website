import React from 'react';
import TabItem from './TabItem';

export default function TabNav() {
  const rootPath = 'questionnaire';
  return (
    <>
      <ul role="tablist">
        <TabItem tabPath={`/${rootPath}/todo`} id="toDo" text="To Do" />
        <TabItem
          tabPath={`/${rootPath}/completed`}
          id="completed"
          text="Completed"
        />
      </ul>
    </>
  );
}
