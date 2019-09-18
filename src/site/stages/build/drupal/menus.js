/* eslint-disable no-param-reassign */

const { getRelatedHubByPath } = require('./utilities-drupal');
const { getArrayDepth } = require('../../../utilities/arrayHelpers');

function convertLinkToAbsolute(hostUrl, pathName) {
  const url = new URL(pathName, hostUrl);
  return url.href;
}

/**
 * Perform a topological sort on the flat list of menu links
 * so that we get back a sorted tree of all links.
 *
 * @param {Array} menuLinks - All menu links as returned from GraphQL, e.g.:
 *
 * [
 *    {
 *      "entityId": "739",
 *      "entityLabel": "About VA",
 *      "menuName": "header-megamenu",
 *      "parent": null,
 *      "weight": 1,
 *      "link": {
 *        "url": {
 *          "path": ""
 *         }
 *       },
 *       "fieldPromoReference": {
 *         "targetId": 27,
 *           "entity": {
 *             "entityId": "27",
 *             "entityLabel": "Agency financial report (Header)",
 *             "fieldImage": {
 *               "targetId": 538
 *             },
 *             "fieldPromoLink": {
 *               "targetId": 7002,
 *               "targetRevisionId": 28921
 *             }
 *           }
 *        },
 *        "title": "About VA",
 *        "uuid": "4f9473b7-c59f-4ad5-9450-a3ed2362ca3f",
 *        "bundle": {
 *          "entity": {
 *            "entityLabel": "Header megamenu"
 *          }
 *        }
 *      },
 *      ...
 *  ]
 *
 * @return {Array} Menu links ordered with depth, hierarchically.
 *
 */
function sortMenuLinksWithDepth(menuLinks) {
  const sortedLinks = []; // The final array of links ordered hierarchically.
  const roots = []; // This will hold links that are parents of others.
  const parentChildrenMap = {}; // Describes relationship of parent links to child links.

  for (const link of menuLinks) {
    // Add in a children property so we can have a hierachy.
    link.children = [];

    // Collect the root items. Roots do not have parents.
    if (link.parent === null) {
      roots.push(link);

      // All other links are children and need to be cached in an array
      // that is keyed by the parent.
      // Menu items always have a parent or null (it can't be undefined).
    } else if (link.parent) {
      // Drupal uses this pattern for the parent property:
      //   menu-link-content:[the-parent-uuid]
      // So, we need to split that up to get the parent's uuid.
      const rootUuid = link.parent.split(':')[1];
      if (!parentChildrenMap[rootUuid]) {
        parentChildrenMap[rootUuid] = [];
      }
      parentChildrenMap[rootUuid].push(link);
    }
  }

  // We go through each parent and push its children into a 'children' array.
  while (roots.length > 0) {
    // Grab first item from roots array.
    const root = roots.shift();

    // If this item is in the top level of the menu (no parent),
    // push it into our sorted list.
    if (root.parent === null) {
      sortedLinks.push(root);
    }

    // Grab the kids from our parentChildrenMap array.
    if (parentChildrenMap[root.uuid]) {
      parentChildrenMap[root.uuid].forEach(child => {
        root.children.push(child);

        // Put this item into the first position of the parents array
        // so we can find its children, if needed.
        // Note that this is how we are able to recurse to an arbitrary depth of menu.
        roots.unshift(child);
      });
    }
  }

  return sortedLinks;
}

function createLinkObj(hostUrl, link) {
  return {
    text: link.title,
    href: convertLinkToAbsolute(hostUrl, link.link.url.path),
  };
}

function makeLinkList(hostUrl, links) {
  const list = [];

  links.forEach(link => {
    const linkObj = createLinkObj(hostUrl, link);
    list.push(linkObj);
  });

  return list;
}

function makePromo(hostUrl, promo) {
  const img = promo.entity.fieldImage.entity.image;
  const link = promo.entity.fieldPromoLink.entity.fieldLink;

  return {
    img: {
      src: convertLinkToAbsolute(hostUrl, img.derivative.url),
      alt: img.alt || '',
    },
    link: {
      text: link.title,
      href: convertLinkToAbsolute(hostUrl, link.url.path),
    },
    description: promo.entity.fieldPromoLink.entity.fieldLinkSummary,
  };
}

function makeColumns(hostUrl, childLinks, arrayDepth, promo, pages) {
  const columns = {};
  const columnNames = [
    // Possible column names.
    'mainColumn',
    'columnOne',
    'columnTwo',
    'columnThree',
    'columnFour',
  ];
  let i = 1;

  // I'm not sure why it's set up this way, but the About VA (arrayDepth = 2)
  // tab starts with 'mainColumn.'
  if (arrayDepth < 3) {
    i = 0;
  }

  childLinks.forEach(childLink => {
    // Create named columns.
    if (childLink.children.length > 0) {
      const column = {
        title: childLink.title,
        links: makeLinkList(hostUrl, childLink.children),
      };
      columns[columnNames[i]] = column;
      i++;

      // If we have no children, then this is the 'See all' link.
      // This also means we will have a promo block related to this hub.
    } else if (arrayDepth === 3) {
      columns.seeAllLink = createLinkObj(hostUrl, childLink);
      promo = getRelatedHubByPath(childLink, pages).fieldPromo;
    }

    if (promo !== null) {
      columns[columnNames[i]] = makePromo(hostUrl, promo);
    }
  });

  return columns;
}

function makeSection(hostUrl, hub, arrayDepth, promo, pages) {
  return {
    title: hub.title,
    links: makeColumns(hostUrl, hub.children, arrayDepth, promo, pages),
  };
}

/**
 * Take the response from the GraphQL query and reformat it
 * into a structure that the megaMenu widget will understand.
 *
 * @param {Object} buildOptions - See /src/stages/build/options.js.
 * @param {Object} contentData - Drupal data received from api query.
 *
 * @return {Array} headerData - Menu information formatted for the megaMenu React widget.
 */
function formatHeaderData(buildOptions, contentData) {
  let menuLinks = contentData.data.menuLinkContentQuery.entities;
  const pages = contentData.data.nodeQuery.entities;
  const headerData = [];
  const { hostUrl } = buildOptions;

  // Sort by menu weight so we don't have do any sorting later.
  menuLinks.sort((a, b) => a.weight - b.weight);

  // To create the desired json schema, we'll need a hierarchical
  // list of menu links, rather than the flat list that Drupal/GraphQL
  // provide.
  menuLinks = sortMenuLinksWithDepth(menuLinks);

  // Top-level.
  menuLinks.forEach(link => {
    const linkObj = { title: link.title };

    // If this top-level item has a link, add it.
    if (link.link.url.path !== '') {
      linkObj.href = convertLinkToAbsolute(hostUrl, link.link.url.path);
    }

    // If we have children, add in menuSections.
    if (link.children.length > 0) {
      const arrayDepth = getArrayDepth(link);

      // For the deepest tabs, like our hub tab.
      // We have an extra left column that defines 'sections', which in practical terms are hubs.
      if (arrayDepth === 3) {
        linkObj.menuSections = [];
        link.children.forEach(child => {
          linkObj.menuSections.push(
            makeSection(
              hostUrl,
              child,
              arrayDepth,
              link.fieldPromoReference,
              pages,
            ),
          );
        });
      } else {
        // For menu tabs with a depth < 3, like our 'About VA' tab.
        // In this case, we go straight to 'columns' rather than defining wider 'sections.'
        // Note, that menuSections is an object in this case, instead of an array.
        linkObj.menuSections = makeColumns(
          hostUrl,
          link.children,
          arrayDepth,
          link.fieldPromoReference,
        );
      }
    }

    headerData.push(linkObj);
  });

  return headerData;
}

module.exports = { formatHeaderData };
