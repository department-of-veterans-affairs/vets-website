// Dependencies
import { each, get, uniqueId, isEmpty } from 'lodash';

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
  const items = get(options, 'items', []);
  const parentID = get(options, 'parentID');
  let navItemsLookup = get(options, 'navItemsLookup', {});

  each(items, (item, index) => {
    // Derive item properties.
    const description = get(item, 'description', '');
    const expanded = get(item, 'expanded', false);
    const href = get(item, 'url.path', '');
    const id = uniqueId();
    const label = get(item, 'label', '');
    const nestedItems = get(item, 'links');

    // Construct the formatted item.
    const formattedItem = {
      description,
      expanded,
      hasChildren: !isEmpty(nestedItems),
      href,
      id,
      label,
      order: index,
      parentID,
    };

    // Always add the item to our lookup table keyed off by ID.
    navItemsLookup[id] = formattedItem;

    // Update our navItemsLookup with the nested items if the option is passed.
    if (!isEmpty(nestedItems)) {
      const nestedNavItemsLookup = deriveNavItemsLookup({
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
export const normalizeSideNavData = data => {
  // Derive properties we need from data.
  const items = get(data, 'links');

  // Derive a nav items array and a lookup table.
  const navItemsLookup = deriveNavItemsLookup({
    items,
    navItemsLookup: {},
  });

  return navItemsLookup;
};
