import React from 'react';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import { replaceDomainsInData } from '../../utilities/environment/stagingDomains';

import recordEvent from '../../monitoring/record-event';

export const FOOTER_COLUMNS = {
  PROGRAMS: '1',
  RESOURCES: '2',
  CONNECT: '3',
  CONTACT: '4',
};

export const FOOTER_EVENTS = {
  [FOOTER_COLUMNS.PROGRAMS]: 'nav-footer-programs',
  [FOOTER_COLUMNS.RESOURCES]: 'nav-footer-resources',
  [FOOTER_COLUMNS.CONNECT]: 'nav-footer-connect',
  [FOOTER_COLUMNS.CONTACT]: 'nav-footer-contact',
  CRISIS_LINE: 'nav-footer-crisis',
};

export function generateLinkItems(links, column, direction = 'asc') {
  const captureEvent = () => recordEvent({ event: FOOTER_EVENTS[column] });
  return (
    <ul className="va-footer-links">
      {orderBy(links[column], 'order', direction).map(link => {
        if (link.href) {
          return (
            <li key={`${link.column}-${link.order}`}>
              <a href={link.href} onClick={captureEvent} target={link.target}>
                {link.title}
              </a>
            </li>
          );
        }

        return (
          <li key={`${link.column}-${link.order}`}>
            <h6>{link.title}</h6>
          </li>
        );
      })}
    </ul>
  );
}

export function createLinkGroups(links) {
  const groupedList = groupBy(replaceDomainsInData(links), 'column');

  return {
    [FOOTER_COLUMNS.PROGRAMS]: generateLinkItems(
      groupedList,
      FOOTER_COLUMNS.PROGRAMS,
    ),
    [FOOTER_COLUMNS.RESOURCES]: generateLinkItems(
      groupedList,
      FOOTER_COLUMNS.RESOURCES,
    ),
    [FOOTER_COLUMNS.CONNECT]: generateLinkItems(
      groupedList,
      FOOTER_COLUMNS.CONNECT,
    ),
    [FOOTER_COLUMNS.CONTACT]: generateLinkItems(
      groupedList,
      FOOTER_COLUMNS.CONTACT,
    ),
    bottomLinks: (
      <ul>
        {orderBy(groupedList.bottom_rail, 'order', 'asc').map(link => (
          <li key={`${link.order}`}>
            <a href={link.href} target={link.target}>
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    ),
  };
}
