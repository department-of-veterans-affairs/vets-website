import React from 'react';
import ReactDOM from 'react-dom';

export async function createScoEventsWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-events"]`),
  );

  if (widgets.length) {
    const {
      default: ScoEventsWidget,
    } = await import(/* webpackChunkName: "sco-event-list" */ './ScoEventsWidget');
    const {
      default: scoEvents,
    } = await import(/* webpackChunkName: "sco-event-list-data" */ './constants/events.json');

    widgets.forEach(el => {
      ReactDOM.render(<ScoEventsWidget scoEvents={scoEvents} />, el);
    });
  }
}

export async function createScoAnnouncementsWidget() {
  const widgets = Array.from(
    document.querySelectorAll(`
    [data-widget-type="sco-announcements"]`),
  );

  if (widgets.length) {
    const {
      default: ScoAnnouncementsWidget,
    } = await import(/* webpackChunkName: "sco-announcements" */ './ScoAnnouncementsWidget');
    const {
      default: announcements,
    } = await import(/* webpackChunkName: "sco-announcements-data" */ './constants/announcements.json');

    widgets.forEach(el => {
      ReactDOM.render(
        <ScoAnnouncementsWidget announcements={announcements} />,
        el,
      );
    });
  }
}
