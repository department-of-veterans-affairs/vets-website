import React from 'react';
import ReactDOM from 'react-dom';

import scoEvents from './constants/events.json';

export default async function createScoEventListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-event-list"]`),
  );

  if (widgets.length) {
    const {
      default: ScoEventListWidget,
    } = await import(/* webpackChunkName: "sco-event-list" */ './ScoEventListWidget');

    widgets.forEach(el => {
      ReactDOM.render(<ScoEventListWidget scoEvents={scoEvents} />, el);
    });
  }
}
