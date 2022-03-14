import React from 'react';
import ReactDOM from 'react-dom';
import { buildOperatingStatusProps } from './buildOperatingStatusProps';

export default async function createExpandableOperatingStatus() {
  const statusWidgets = Array.from(
    document.querySelectorAll(
      'div[data-widget-type^=expandable-operating-status]',
    ),
  );

  if (statusWidgets.length) {
    const {
      default: ExpandableOperatingStatus,
    } = await import('./components/ExpandableOperatingStatus');

    statusWidgets.forEach(el => {
      if (
        !el.attributes?.status?.nodeValue ||
        el.attributes?.status?.nodeValue === 'normal'
      )
        return;

      const attrs = {
        opStatus: el.attributes?.status?.nodeValue,
        opStatusExtra: el.attributes?.info?.nodeValue,
      };

      ReactDOM.render(
        <div className="vads-u-margin-bottom--1">
          <ExpandableOperatingStatus {...buildOperatingStatusProps(attrs)} />
        </div>,
        el,
      );
    });
  }
}
