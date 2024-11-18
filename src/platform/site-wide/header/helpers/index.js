import { isArray } from 'lodash';

export const hideDesktopHeader = () => {
  const desktopHeader = document.getElementById('legacy-header');

  if (!desktopHeader) {
    return;
  }

  if (!desktopHeader.classList.contains('vads-u-display--none')) {
    desktopHeader.classList.add('vads-u-display--none');
  }
};

export const showDesktopHeader = () => {
  const desktopHeader = document.getElementById('legacy-header');

  if (!desktopHeader) {
    return;
  }

  if (desktopHeader.classList.contains('vads-u-display--none')) {
    desktopHeader.classList.remove('vads-u-display--none');
  }
};

/**
 * Shows or hides the minimal header and does
 * the opposite for the default header simultaneously.
 *
 * @param {boolean} show
 */
export const toggleMinimalHeader = show => {
  const minimalHeader = document.getElementById('header-minimal');
  const defaultHeader = document.getElementById('header-default');

  if (!minimalHeader || !defaultHeader) {
    return;
  }

  minimalHeader.classList.toggle('vads-u-display--none', !show);
  defaultHeader.classList.toggle('vads-u-display--none', show);
};

export const formatMenuItems = menuItems => {
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

  // Do not do anything for column three according to current code in production.
  if (menuItems?.columnThree) {
    // formattedMenuItems.push({
    //   title: menuItems?.columnThree?.title,
    //   links: menuItems?.columnThree?.links,
    // });
  }

  return formattedMenuItems;
};

export const formatSubMenuSections = subMenuSections => {
  return subMenuSections?.reduce((allSubMenuSections, item) => {
    if (!item?.links) {
      allSubMenuSections.push({
        href: item?.href,
        links: item?.links,
        text: item?.title || item?.text,
      });
      return allSubMenuSections;
    }

    allSubMenuSections = [...allSubMenuSections, ...item?.links]; // eslint-disable-line no-param-reassign
    return allSubMenuSections;
  }, []);
};

export const deriveMenuItemID = (item, level) => {
  const formattedTitle = item?.title || item?.text || '';
  const formattedHref = item?.href || '';
  const formattedLevel = level || '';
  return `${formattedTitle}-${formattedHref}-${formattedLevel}`;
};
