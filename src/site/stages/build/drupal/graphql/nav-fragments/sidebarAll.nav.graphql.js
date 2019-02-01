/**
 * Full sidebar navigation
 *
 */

module.exports = `
  fragment sideNav on TaxonomyTermSidebarNavigation {
      entityBundle
      tid
      name
      fieldIcon
      fieldNavItemLink {
        uri
        url {
          path
        }
      }
      reverseParentTaxonomyTerm {
        ... on EntityQueryResult {
          entities {
             ... on TaxonomyTermSidebarNavigation {
              name
              fieldIcon
              fieldNavItemLink {
                uri
                url {
                  path
                }
              }
              reverseParentTaxonomyTerm {
                ... on EntityQueryResult {
                  entities {
                    ... on TaxonomyTermSidebarNavigation {
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
}
`;