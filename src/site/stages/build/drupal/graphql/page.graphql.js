/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

const sidebarItem = require('./nav-fragments/sidebarItem.nav.graphql');

module.exports = `

  ${sidebarItem}
  
  fragment page on NodePage {
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
    entityBundle
    entityPublished
    title
    fieldIntroText
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        entityRendered
      }
    }
    ... sidebarItem
    changed
  }
`;
