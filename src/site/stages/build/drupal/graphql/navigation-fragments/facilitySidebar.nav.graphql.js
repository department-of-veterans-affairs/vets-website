/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

// TODO - refactor code to avoid use of global
const FACILITY_MENU_NAMES = global.cmsSideNavs;

const FACILITY_SIDEBAR_QUERY = `
    name
    description
    links {
      label
      expanded
      description
      url {
        path
      }
      links {
        label
        expanded
        description
        url {
          path
        }
        links {
          label
          expanded
          description
          url {
            path
          }
          links {
            label
            expanded
            description
            url {
              path
            }
            links {
              label
              expanded
              description
              url {
                path
              }
              links {
                label
                expanded
                description
                url {
                  path
                }
              }
            }
          }
        }
      }
    }
`;

let compiledQuery = '';

FACILITY_MENU_NAMES.forEach(facilityMenuName => {
  compiledQuery += `
         ${camelize(
           facilityMenuName,
         )}FacilitySidebarQuery: menuByName(name: "${facilityMenuName}") {
            ${FACILITY_SIDEBAR_QUERY}
         }
        `;
});

module.exports = compiledQuery;
