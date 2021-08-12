// Dependencies
import { each, get, isEmpty, set, trimEnd, uniqueId } from 'lodash';

/* Recursive function that expands all `parentID`s.
  @param {Object}, options:
  {
    navItemID: string,
    navItemsLookup: object,
  }
  @returns {Object}, navItemsLookup is keyed off `id`.
*/
const expandParentIDs = options => {
  // Derive the properties from options.
  const navItemID = get(options, 'navItemID');
  const navItemsLookup = get(options, 'navItemsLookup', {});

  // Derive the nav item properties.
  const navItem = get(navItemsLookup, `[${navItemID}]`);
  const expanded = get(navItem, 'expanded');
  const parentID = get(navItem, 'parentID');

  // Stop recursing if the item is already expanded.
  if (expanded) {
    return navItemsLookup;
  }

  // Update the nav item to expanded.
  set(navItem, 'expanded', true);

  // Stop recursing if we went through all the parents.
  if (!parentID) {
    return navItemsLookup;
  }

  // Continue recursively expanding all parentIDs.
  return expandParentIDs({ navItemID: parentID, navItemsLookup });
};

/* Recursive function that derives `navItems` and `navItemsLookup` for `normalizeSideNavData`.
  @param {Object}, options:
  {
    items: array,
    parentID: string,
    navItemsLookup: object,
  }
  @returns {Object}, navItemsLookup is keyed off `id`.
*/
const deriveNavItemsLookup = options => {
  // Derive the properties from options.
  const rootPath = get(options, 'rootPath');
  const depth = get(options, 'depth', 0);
  const items = get(options, 'items', []);
  const parentID = get(options, 'parentID');
  let navItemsLookup = get(options, 'navItemsLookup', {});

  // Determine if the nav items are top-level.
  const isTopNavItem = depth < 2;

  each(items, (item, index) => {
    // Derive item properties.
    const description = get(item, 'description', '');
    const href = get(item, 'url.path', '');
    const id = uniqueId('sidenav_');
    const label = get(item, 'label', '');
    const nestedItems = get(item, 'links');

    // Derive the current path.
    const pathname = trimEnd(rootPath, '/');

    // Derive if the item is selected.
    const isSelected = pathname === href;

    // Construct the formatted item.
    const formattedItem = {
      depth,
      description,
      expanded: isTopNavItem || isSelected,
      hasChildren: !isEmpty(nestedItems),
      href,
      id,
      label,
      order: index,
      parentID,
      isSelected,
    };

    // Always add the item to our lookup table keyed off by ID.
    navItemsLookup[id] = formattedItem;

    // Expand all of the nav item's parents if it's selected.
    if (isSelected) {
      navItemsLookup = expandParentIDs({ navItemID: parentID, navItemsLookup });
    }

    // Update our navItemsLookup with the nested items if the option is passed.
    if (!isEmpty(nestedItems)) {
      const nestedNavItemsLookup = deriveNavItemsLookup({
        rootPath,
        depth: depth + 1,
        items: nestedItems,
        navItemsLookup,
        parentID: id,
      });

      // Update our navItemsLookup with the nested items.
      navItemsLookup = {
        ...navItemsLookup,
        ...nestedNavItemsLookup,
      };
    }
  });

  return navItemsLookup;
};

/* `normalizeSideNavData` returns normalized SideNav data.
  @param {Object} data, will likely look like:
  {
    description: string,
    links: arrayOf(
      {
        description: string,
        expanded: bool,
        label: string,
        links: array, (... and so on)
        url: {
          path: string,
        }),
      }),
    ),
    name: string,
  }

  @returns {Object}, navItemsLookup keyed off by `id`.
*/
export const normalizeSideNavData = (rootPath, data) => {
  // Derive properties we need from data.
  const items = data?.links;

  // Derive only nav items that are relevant for the current page.
  const relevantNavItems = items?.filter(item =>
    rootPath.includes(item?.url?.path),
  );

  // Derive a nav items array and a lookup table.
  return deriveNavItemsLookup({
    rootPath,
    items: relevantNavItems,
    navItemsLookup: {},
  });
};
