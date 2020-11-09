/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

const { getSideNavsViaGraphQL } = require('../../metalsmith-drupal');

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

async function compiledQuery() {
  const sideNavs = await getSideNavsViaGraphQL();
  const queries = [];
  sideNavs.forEach(facilityMenuName => {
    queries.push(`
      ${camelize(
        facilityMenuName,
      )}FacilitySidebarQuery: menuByName(name: "${facilityMenuName}") {
            ${FACILITY_SIDEBAR_QUERY}
         }
        `);
  });
  return queries.join('');
}

module.exports = { compiledQuery };
