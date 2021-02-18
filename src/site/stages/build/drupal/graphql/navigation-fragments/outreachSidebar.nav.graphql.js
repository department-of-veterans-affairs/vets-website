/**
 * The sidebar navigation menu from Drupal for display on outreach and event pages
 *
 */

const MENU_NAME = 'outreach-and-events';

const outreachSidebarQuery = `
  outreachSidebarQuery: menuByName(name: "${MENU_NAME}") {
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

const GetOutreachSidebar = `
  query {
    ${outreachSidebarQuery}
  }
`;

module.exports = {
  partialQuery: outreachSidebarQuery,
  GetOutreachSidebar,
};
