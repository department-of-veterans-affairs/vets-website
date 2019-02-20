/**
 * The sidebar navigation menu from Drupal for display on basic pages
 * @TODO: change this to retrieve correct menu once sidebar nav migration is complete
 */

const MENU_NAME = 'main';

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
            }
          }
        }
      }
    }
  }
`;
