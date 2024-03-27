import { updateLinkDomain } from './links';

// Shared utilities between the desktop and mobile footer
const makeLink = link => {
  let label = '';

  if (link.label) {
    label = `<h2 class="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">${
      link.label
    }</h2>`;
  }

  return `<li>${label}
    <a href=${updateLinkDomain(link.href)}>${link.title}</a>
  </li>`;
};

export const buildColumn = (columns, number) => {
  return columns[number]
    .map(link => makeLink(link))
    .join()
    .replaceAll(',', '');
};

export const buildBottomRail = bottomRailData => {
  return bottomRailData
    .map(
      link =>
        `<li><a href=${updateLinkDomain(link.href)}>${link.title}</a></li>`,
    )
    .join()
    .replaceAll(',', '');
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
