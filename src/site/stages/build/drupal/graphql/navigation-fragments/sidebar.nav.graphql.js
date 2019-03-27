/**
 * The sidebar navigation menu from Drupal for display on basic pages
 */

const MENU_NAME = 'health-care-benefits-hub';

module.exports = `
  sidebarQuery: menuByName(name: "${MENU_NAME}") {
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
  }
`;
