import { isArray, kebabCase } from 'lodash';
import { updateLinkDomain } from '../../../../utilities/links';

const formatMenuItems = menuItems => {
  const formattedMenuItems = [];

  if (menuItems && isArray(menuItems)) {
    return menuItems;
  }

  if (menuItems?.seeAllLink) {
    formattedMenuItems.push({
      title: menuItems?.seeAllLink?.text,
      href: menuItems?.seeAllLink?.href,
    });
  }

  if (menuItems?.mainColumn) {
    formattedMenuItems.push({
      title: menuItems?.mainColumn?.title,
      links: menuItems?.mainColumn?.links,
    });
  }

  if (menuItems?.columnOne) {
    formattedMenuItems.push({
      title: menuItems?.columnOne?.title,
      links: menuItems?.columnOne?.links,
    });
  }

  if (menuItems?.columnTwo) {
    formattedMenuItems.push({
      title: menuItems?.columnTwo?.title,
      links: menuItems?.columnTwo?.links,
    });
  }

  return formattedMenuItems;
};

const buildLinks = linkGroups => {
  const linkHtml = (text, href) =>
    `<li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold" data-e2e-id="${kebabCase(
      text,
    )}"><a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="${updateLinkDomain(
      href,
    )}" data-e2e-id="${kebabCase(text)}">${text}</a></li>`;

  return linkGroups
    .map(group => {
      if (group.links) {
        return group.links.map(link => linkHtml(link.text, link.href));
      }
      if (Array.isArray(group)) {
        return group.map(link => linkHtml(link.text, link.href));
      }
      return linkHtml(group.text || group.title, group.href);
    })
    .join()
    .replaceAll(',', '');
};

const containerForLinks = (title, linkGroups) => {
  return `
    <div id="${kebabCase(
      title,
    )}-menu" hidden class="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">
      <ul class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">
        <li class="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
          <button class="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center" id="header-back-to-menu" type="button">
            <i aria-hidden="true" class="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"></i>Back to menu
          </button>
        </li>
        ${buildLinks(linkGroups)}
      </ul>
    </div>
  `;
};

// Build hub child links
export const buildLevelThreeLinks = menuSections => {
  const linkContainers = [];

  if (!menuSections) {
    return ``;
  }

  if (Array.isArray(menuSections)) {
    for (const section of menuSections) {
      if (section.links) {
        linkContainers.push(
          containerForLinks(section.title, formatMenuItems(section.links)),
        );
      }
    }
  } else {
    const linkGroups = formatMenuItems(menuSections);

    linkGroups.forEach(group => {
      linkContainers.push(containerForLinks(group.title, group.links));
    });

    return linkContainers;
  }

  return linkContainers;
};
