import React from 'react';
import ReactDOM from 'react-dom';

export default async function createExpandableOperatingStatus() {
  const statusWidgets = Array.from(
    document.querySelectorAll(
      'div[data-widget-type^=expandable-operating-status]',
    ),
  );

  if (statusWidgets.length) {
    const {
      default: ExpandableOperatingStatus,
    } = await import('../../shared/ExpandableOperatingStatus');

    statusWidgets.forEach(el => {
      if (
        !el.attributes.status.nodeValue ||
        el.attributes?.status?.nodeValue === 'normal'
      )
        return;
      let status;
      let iconType;

      switch (el.attributes.status.nodeValue) {
        case 'limited':
          status = 'Limited services and hours';
          iconType = 'triangle';
          break;
        case 'closed':
          status = 'Facility closed';
          iconType = 'circle';
          break;
        case 'notice':
          status = 'Facility notice';
          iconType = 'circle';
          break;
        default:
          status = 'Facility status';
          iconType = 'triangle';
      }

      ReactDOM.render(
        <div className="vads-u-margin-bottom--1">
          <ExpandableOperatingStatus
            operatingStatusFacility={el.attributes.status.nodeValue}
            statusLabel={status}
            iconType={iconType}
            extraInfo={el.attributes.info.nodeValue}
          />
        </div>,
        el,
      );
    });
  }
}
