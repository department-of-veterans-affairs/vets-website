import React from 'react';
import ReactDOM from 'react-dom';

import scoEvents from './constants/events.json';

export async function createScoEventListWidget() {
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

export async function createScoAnnouncementsWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-event-list"]`),
  );

  if (widgets.length) {
    const {
      default: ScoAnnouncementsWidget,
    } = await import(/* webpackChunkName: "sco-announcements" */ './ScoAnnouncementsWidget');
    const announcements = await import(/* webpackChunkName: "sco-announcements-data" */ './ScoAnnouncementsWidget');

    widgets.forEach(el => {
      ReactDOM.render(
        <ScoAnnouncementsWidget accouncements={announcements} />,
        el,
      );
    });
  }
}
