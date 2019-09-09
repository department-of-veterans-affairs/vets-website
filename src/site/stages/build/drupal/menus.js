/* eslint-disable no-param-reassign, no-continue, no-console */

/* 
 * Perform a topological sort on the flat list of menu links
 * so that we get back a sorted tree of all links.
 * Along the way, add a 'depth' property to each link.
 */
function sortMenuLinksWithDepth(menuLinks) {
  const sortedLinks = [];
  const roots = [];
  const children = [];

  for (const link of menuLinks) {
    // Add in a children property so we can have a hierachy.
    link.children = [];

    // Collect the root items. AD
    if (link.parent === null) {
      link.depth = 0;
      roots.push(link);

      // All other links are children and need to be cached in an array
      // that is keyed by the parent.
    } else if (link.parent) {
      const rootUuid = link.parent.split(':')[1];
      if (!children[rootUuid]) {
        children[rootUuid] = [];
      }
      children[rootUuid].push(link);
    }
  }

  // We go through each parent and push its children into a 'children' array.
  while (roots.length > 0) {
    // Grab first item from roots array.
    const root = roots.shift();
    const rootDepth = root.depth;

    // Only push true roots onto our sorted list.
    if (root.parent === null) {
      sortedLinks.push(root);
    }

    // Grab the kids from our children array.
    if (children[root.uuid]) {
      children[root.uuid].forEach(child => {
        child.depth = rootDepth + 1;
        root.children.push(child);

        // Put this item into the first position of the roots array so we can find its children, if needed.
        roots.unshift(child);
      });
    }
  }

  return sortedLinks;
}

function createLinkObj(link) {
  return {
    text: link.title,
    href: link.link.url.path,
  };
}

function makeLinkList(links) {
  const list = [];

  links.forEach(link => {
    const linkObj = createLinkObj(link);
    list.push(linkObj);
  });

  return list;
}

function getArrayDepth(arr) {
  const counter = curArr =>
    curArr.children[0] ? Math.max(...curArr.children.map(counter)) + 1 : 0;
  return counter(arr);
}

function makeColumns(childLinks, arrayDepth) {
  const columns = {};
  const columnNames = ['columnOne', 'columnTwo', 'columnThree', 'columnFour']; // Possible column names.
  let i = 0;

  childLinks.forEach(childLink => {
    // Create named columns.
    if (childLink.children.length > 0) {
      const column = {
        title: childLink.title,
        links: makeLinkList(childLink.children),
      };
      columns[columnNames[i]] = column;
      i++;

      // If we have no children, then this is the 'See all' link.
    } else if (arrayDepth === 3) {
      columns.seeAllLink = createLinkObj(childLink);
    }
  });

  return columns;
}

function makeSection(child, arrayDepth) {
  return {
    title: child.title,
    links: makeColumns(child.children, arrayDepth),
  };
}

function formatHeaderData(menuLinks) {
  let headerData = [];

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
      linkObj.href = link.link.url.path;
    }

    // If we have children, add in menuSections.
    if (link.children.length > 0) {
      const arrayDepth = getArrayDepth(link);

      // For the deepest tabs, like our hub tab.
      // We have an extra left column that defines 'sections', which in practical terms are hubs.
      if (arrayDepth === 3) {
        linkObj.menuSections = [];
        link.children.forEach(child => {
          linkObj.menuSections.push(makeSection(child, arrayDepth));
        });
      } else {
        // For menu tabs with a depth < 3, like our 'About VA' tab.
        // In this case, we go straight to 'columns' rather than defining wider 'sections.'
        // Note, that menuSections is an object in this case, instead of an array.
        linkObj.menuSections = makeColumns(link.children, arrayDepth);
      }
    }

    headerData.push(linkObj);
  });

  headerData = menuLinks;
  return headerData;
}

module.exports = { formatHeaderData };
