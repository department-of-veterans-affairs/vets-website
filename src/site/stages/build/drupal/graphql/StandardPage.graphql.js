/**
 *
 */
module.exports = `
  fragment StandardPage on NodePage {
    entityUrl {
      path
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
