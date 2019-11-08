import React from 'react';
import ReactDOM from 'react-dom';

export default async function createScoEventListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-event-list"]`),
  );

  if (widgets.length) {
    const {
      default: ScoEventListWidget,
    } = await import(/* webpackChunkName: "sco-event-list" */ './ScoEventListWidget');
    const {
      default: scoEvents,
    } = await import(/* webpackChunkName: "sco-event-list-data" */ './constants/events.json');

    widgets.forEach(el => {
      ReactDOM.render(<ScoEventListWidget scoEvents={scoEvents} />, el);
    });
  }
}
