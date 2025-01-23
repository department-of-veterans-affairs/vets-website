import React from 'react';
import { updateLinkDomain } from './links';

// Shared utilities between the desktop and mobile footer
const makeLink = (link, index) => {
  let label = '';

  if (link.label) {
    label = (
      <h2
        className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1"
        key={index}
      >
        {link.label}
      </h2>
    );
  }

  return (
    <li key={index}>
      {label}
      <a
        href={updateLinkDomain(link.href)}
        aria-label={link.ariaLabel ? link.ariaLabel : null}
      >
        {link.title}
      </a>
    </li>
  );
};

export const buildColumn = (columns, number) => {
  return columns[number].map((link, index) => makeLink(link, index));
};

export const buildBottomRail = bottomRailData => {
  return bottomRailData.map((link, index) => (
    <li key={index}>
      <a href={updateLinkDomain(link.href)}>{link.title}</a>
    </li>
  ));
};

/**
 * Consolidates the footer data from Drupal into a consumable format
 * Example:
 * {
 *   1: [
 *     {
 *       column: 1,
 *       title: 'Homeless Veterans',
 *       href: '/homeless'
 *     }
 *   ]
 *   2: [
 *     {
 *       column: 2,
 *       title: 'VA forms',
 *       href: '/find-forms'
 *     }
 *   ]
 * }
 */
export const getFormattedFooterData = footerData => {
  return footerData.reduce((value, acc) => {
    const link = value;

    link[acc.column] = link[acc.column] || [];
    link[acc.column].push(acc);

    // eslint-disable-next-line no-param-reassign
    return link;
  }, {});
};
