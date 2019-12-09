/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

const FACILITY_MENU_NAMES = [
  'pittsburgh-health-care',
  'va-altoona-health-care',
  'va-butler-health-care',
  'va-coatesville-health-care',
  'va-erie-health-care',
  'va-lebanon',
  'va-philadelphia-health-care',
  'va-wilkes-barre-health-care',
  'va-wilmington-health-care',
];

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
