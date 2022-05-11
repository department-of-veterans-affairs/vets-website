import React from 'react';
import ReactDOM from 'react-dom';
import { buildVaAlertExpandableProps } from './buildVaAlertExpandableProps';

export default async function createVaAlertExpandable() {
  const statusWidgets = Array.from(
    document.querySelectorAll(
      'div[data-widget-type^=expandable-supplemental-status]',
    ),
  );

  if (statusWidgets.length) {
    const { default: VaAlertExpandable } = await import('./VaAlertExpandable');

    statusWidgets.forEach(el => {
      if (
        !el.attributes?.status?.nodeValue ||
        el.attributes?.status?.nodeValue === 'normal'
      )
        return;

      const attrs = {
        opStatus: el.attributes?.status?.nodeValue,
        opStatusLabel: el.attributes?.statusLabel?.nodeValue,
        opStatusExtra: el.attributes?.info?.nodeValue,
      };

      ReactDOM.render(
        <div className="vads-u-margin-bottom--1">
          <VaAlertExpandable {...buildVaAlertExpandableProps(attrs)} />
        </div>,
        el,
      );
    });
  }
}
