import React from 'react';
import ReactDOM from 'react-dom';

export default async function createExpandableOperatingStatus() {
  const widgets = Array.from(
    document.querySelectorAll(
      `[data-widget-type="expandable-operating-status"]`,
    ),
  );

  if (widgets.length) {
    const {
      default: ExpandableOperatingStatus,
    } = await import('./ExpandableOperatingStatus');

    widgets.forEach(el => {
      ReactDOM.render(
        <ExpandableOperatingStatus status={'Facility extra'} />,
        el,
      );
    });
  }
}
