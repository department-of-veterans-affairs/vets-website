/**
 * The sidebar navigation menu from Drupal for display on basic pages
 */

const SIDEBAR_QUERY = `
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

function queryFilter(menuName) {
  return `
      menuByName(name: "${menuName}")
    `;
}

module.exports = `
    healthcareHubSidebarQuery: ${queryFilter('health-care-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    recordsHubSidebarQuery: ${queryFilter('records-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    pensionHubSidebarQuery: ${queryFilter('pension-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
`;
