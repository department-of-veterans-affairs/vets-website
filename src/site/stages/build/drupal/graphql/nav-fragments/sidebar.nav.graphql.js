/**
 * Sidebar navigation data for basic pages
 *
 */
module.exports = `
  fragment sideNav on NodePage {
  fieldSidebarNavItem {
    entity {
      entityBundle
      ... on TaxonomyTermSidebarNavigation {
        tid
        name
        fieldIcon
        fieldNavItemLink {
          uri
          url {
            path
          }
        }
      }
      ... on TaxonomyTerm {
        reverseParentTaxonomyTerm {
          ... on EntityQueryResult {
            entities {
              ... on TaxonomyTermSidebarNavigation {
                tid
                name
                fieldIcon
                fieldNavItemLink {
                  uri
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
  }
}
`;
