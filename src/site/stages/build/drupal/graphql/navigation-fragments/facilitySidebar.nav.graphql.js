/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

const MENU_NAME = 'pittsburg-healthcare';

module.exports = `
  facilitySidebarQuery: menuByName(name: "${MENU_NAME}") {
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
