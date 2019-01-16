/**
 *
 */
module.exports = `
  fragment StandardPage on NodePage {
    entityUrl {
      path
      routed
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
  }
`;
