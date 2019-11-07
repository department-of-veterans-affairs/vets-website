import React from 'react';
import ReactDOM from 'react-dom';

import scoInformation from './constants/sco_information.json';

export default async function createScoEventListWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-event-list"]`),
  );

  if (widgets.length) {
    const {
      default: ScoEventListWidget,
    } = await import(/* webpackChunkName: "sco-event-list" */ './ScoEventListWidget');

    const eventList = scoInformation.filter(item =>
      ['event', 'webinar'].includes(item.type.toLowerCase()),
    );

    // since these widgets are on content pages, we don't want to focus on them
    widgets.forEach(el => {
      ReactDOM.render(<ScoEventListWidget scoEvents={eventList} />, el);
    });
  }
}
