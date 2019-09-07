/* eslint-disable no-param-reassign, no-continue, no-console */

/* 
 * Perform a depth-first topological sort on the flat list of menu links
 * so that we get back a sorted tree of all links.
 * Along the way, add a 'depth' property to each link.
 */
function sortMenuLinks(menuLinks) {
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

  // console.log(roots);
  // console.log(children);

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

function log(item) {
  console.dir(item, { depth: null, maxArrayLength: null });
}

function formatHeaderData(menuLinks) {
  let headerData = [];

  // Sort by menu weight so we don't have do any sorting later.
  menuLinks.sort((a, b) => a.weight - b.weight);

  // To create the desired json schema, we'll need a hierarchical
  // list of menu links, rather than the flat list that Drupal/GraphQL
  // provide.
  menuLinks = sortMenuLinks(menuLinks);

  log('****');
  log(menuLinks);

  headerData = menuLinks;
  return headerData;
}

module.exports = { formatHeaderData };
