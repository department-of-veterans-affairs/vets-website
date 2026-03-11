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
  SUPERLINKS: 'bottom_rail',
};

export const FOOTER_EVENTS = {
  [FOOTER_COLUMNS.PROGRAMS]: 'nav-footer-programs',
  [FOOTER_COLUMNS.RESOURCES]: 'nav-footer-resources',
  [FOOTER_COLUMNS.CONNECT]: 'nav-footer-connect',
  [FOOTER_COLUMNS.CONTACT]: 'nav-footer-contact',
  [FOOTER_COLUMNS.SUPERLINKS]: 'nav-footer-superlinks',
  CRISIS_LINE: 'nav-footer-crisis',
  LANGUAGE_SUPPORT: 'nav-footer-language-support',
};

const renderLinkContent = (link, captureEvent) =>
  link.href ? (
    <a aria-label={link.ariaLabel} href={link.href} onClick={captureEvent}>
      {link.title}
    </a>
  ) : (
    <span className="vads-u-color--white">{link.title}</span>
  );

export function generateLinkItems(links, column, direction = 'asc') {
  const captureEvent = () => recordEvent({ event: FOOTER_EVENTS[column] });
  const sortedLinks = orderBy(links[column], 'order', direction);

  // Group links into sections split by items that have a label (heading).
  // Each section is { label: string|null, items: [] }.
  const sections = sortedLinks.reduce((acc, link) => {
    if (link.label) {
      acc.push({ label: link.label, items: [link] });
    } else if (acc.length === 0) {
      acc.push({ label: null, items: [link] });
    } else {
      acc[acc.length - 1].items.push(link);
    }
    return acc;
  }, []);

  return (
    <>
      {sections.map((section, sIdx) => (
        <React.Fragment key={section.label || `section-${sIdx}`}>
          {section.label && (
            <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
              {section.label}
            </h2>
          )}
          <ul className="va-footer-links">
            {section.items.map(link => (
              <li key={`${link.column}-${link.order}`}>
                {renderLinkContent(link, captureEvent)}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </>
  );
}

function generateSuperLinks(groupedList) {
  const captureEvent = () => {
    recordEvent({ event: FOOTER_EVENTS[FOOTER_COLUMNS.SUPERLINKS] });
  };

  return (
    <ul>
      {orderBy(groupedList.bottom_rail, 'order', 'asc').map(link => (
        <li key={`${link.order}`}>
          <a
            aria-label={link.ariaLabel}
            href={link.href}
            onClick={captureEvent}
          >
            {link.title}
          </a>
        </li>
      ))}
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
    bottomLinks: generateSuperLinks(groupedList),
  };
}
