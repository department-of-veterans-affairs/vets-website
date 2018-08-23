import React from 'react';
import LeftRailNav from '@department-of-veterans-affairs/formation/LeftRailNav';
import megaMenuData from '../../../mega-menu/data.json';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  getMenuSections() {
    const page = pageMetaData.collections.filter((collection) => {
      return location.pathname.includes(collection.href);
    })[0];

    if (page.href.split('/').length > 2) {
      return pageMetaData.collections.map((pageData) => {

        if (pageData.childPages.length > 0) {
          return {
            title: pageData.text,
            href: pageData.href,
            links: pageData.childPages,
          };
        }

        return pageData;
      });
    }

    if (page.childPages.length > 0) {
      return pageMetaData.collections.map((pageData) => {

        if (pageData.childPages.length > 0) {
          return {
            title: pageData.text,
            href: pageData.href,
            links: pageData.childPages,
          };
        }

        return pageData;
      });
    }

    const section = megaMenuData[0].menuSections.filter((menuSection) => {
      return menuSection.title === 'Health Care';
    })[0];

    return [section.links.columnOne, section.links.columnTwo];
  }

  isHidden(links) {
    return !links.some((link) => {
      return link.href.includes(location.pathname.slice(1));
    });
  }

  isCurrentPage(page) {
    return location.pathname.includes(page.href);
  }

  render() {
    return (
      <LeftRailNav
        title={pageMetaData.mainRouteName}
        icon="fa-medkit"
        data={this.getMenuSections()}
        hidden={(links) => this.isHidden(links)}
        isCurrentPage={(href) => this.isCurrentPage(href)}
        currentPage={location.pathname}>
      </LeftRailNav>
    );
  }
}

export default Main;
