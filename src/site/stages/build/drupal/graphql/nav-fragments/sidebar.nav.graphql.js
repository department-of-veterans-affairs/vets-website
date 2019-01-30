/**
 * Sidebar navigation data for basic pages
 *
 */
module.exports = `
  fragment sideNavItem on NodePage {
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
