import React from 'react';
import { updateLinkDomain } from './links';

// Shared utilities between the desktop and mobile footer
export const buildColumn = (columns, number) => {
  // Group links into sections split by items that have a label (heading).
  // Each section is { label: string|null, items: [] }.
  const sections = columns[number].reduce((acc, link) => {
    if (link.label) {
      acc.push({ label: link.label, items: [link] });
    } else if (acc.length === 0) {
      acc.push({ label: null, items: [link] });
    } else {
      acc[acc.length - 1].items.push(link);
    }
    return acc;
  }, []);

  return sections.map((section, sIdx) => (
    <React.Fragment key={section.label || `section-${sIdx}`}>
      {section.label && (
        <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
          {section.label}
        </h2>
      )}
      <ul className="va-footer-links">
        {section.items.map((link, index) => (
          <li key={index}>
            <a
              href={updateLinkDomain(link.href)}
              aria-label={link.ariaLabel ? link.ariaLabel : null}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </React.Fragment>
  ));
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
