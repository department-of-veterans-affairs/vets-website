import React from 'react';
import TabItem from './TabItem';

export default function TabNav() {
  return (
    <>
      <ul role="tablist">
        <TabItem href="#section1" id="toDo" text="To Do" />
        <TabItem href="#section2" id="completed" text="Completed" />
      </ul>
    </>
  );
}
