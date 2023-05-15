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

const renderInnerTag = (link, captureEvent) => (
  <>
    {link.label ? (
      <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
        {link.label}
      </h2>
    ) : null}
    {link.href ? (
      <a
        aria-label={link.ariaLabel}
        href={link.href}
        onClick={captureEvent}
        target={link.target}
        rel={link.rel}
      >
        {link.title}
      </a>
    ) : (
      <span className="vads-u-color--white">{link.title}</span>
    )}
  </>
);

export function generateLinkItems(links, column, direction = 'asc') {
  const captureEvent = () => recordEvent({ event: FOOTER_EVENTS[column] });
  return (
    <ul className="va-footer-links">
      {orderBy(links[column], 'order', direction).map(link => (
        <li key={`${link.column}-${link.order}`}>
          {renderInnerTag(link, captureEvent)}
        </li>
      ))}
    </ul>
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
            target={link.target}
            rel={link.rel}
          >
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

const FOOTER_SECTIONS = {
  BOTTOM_RAIL: 'bottomRailFooterData',
  FOOTER_COLUMNS: 'footerColumnsData',
  HARD_CODED: 'hardCodedFooterData',
};

export const formatLink = (link, linkIndex, columnNumber = null) => {
  return {
    column: columnNumber,
    href: link?.url?.path,
    order: linkIndex + 1,
    target: null,
    title: link?.description,
  };
};

/**
 * We're getting columns 1 - 3 and the bottom rail footer data from Drupal
 * Column 4 (Need help column) is still coming hardcoded from content-build
 * This utility helps consistently format the data for consumption
 */
export const reformatDrupalFooterData = sections => {
  const formattedData = [];

  Object.keys(sections).forEach(section => {
    const sectionData = sections[section];

    // Format columns 1 - 3 of data
    if (section === FOOTER_SECTIONS.FOOTER_COLUMNS) {
      sectionData?.links?.forEach((column, columnIndex) => {
        column?.links?.forEach((link, linkIndex) => {
          formattedData.push(formatLink(link, linkIndex, columnIndex + 1));
        });
      });
      // Format bottom rail of data
    } else if (section === FOOTER_SECTIONS.BOTTOM_RAIL) {
      sectionData?.links?.forEach((link, linkIndex) => {
        formattedData.push(formatLink(link, linkIndex, 'bottom_rail'));
      });
      // Format column 4 of data
    } else {
      formattedData.push(...sectionData);
    }
  });

  return formattedData;
};

export function createLinkGroups(links) {
  const formattedList = reformatDrupalFooterData(links);
  const groupedList = groupBy(replaceDomainsInData(formattedList), 'column');

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
