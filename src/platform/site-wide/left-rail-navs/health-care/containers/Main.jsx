import React from 'react';
import LeftRailNav from '../../components/LeftRailNav';
import navData from '../data';

export class Main extends React.Component {
  getMenuSections() {
    const page = pageMetaData.collections.filter((collection) => {
      return location.pathname.includes(collection.href);
    })[0];
    // TODO: brittle. Need to refactor
    if (page.href.split('/').length > 3) {
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
      const newData = navData.reduce((acc, item) => {
        const linksHasPage = item.links.some((link) => {
          return link.href.includes(page.href);
        });

        if (linksHasPage) {
          const newLinks = item.links.map((linkItem) => {
            // TODO: Need to change this logic because it is very brittle.
            if (linkItem.href.includes(page.href)) {
              return {
                title: linkItem.text,
                href: linkItem.href,
                links: page.childPages,
              };
            }

            return linkItem;
          });

          acc.push({
            ...item,
            links: newLinks,
          });
        } else {
          acc.push(item);
        }

        return acc;
      }, []);

      return newData;
    }

    return navData;
  }

  isHidden(links) {
    return !links.some((link) => {
      return link.href.includes(location.pathname);
    });
  }

  isCurrentPage(page) {
    if (page.href) {
      return location.pathname.includes(page.href);
    }

    return false;
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
