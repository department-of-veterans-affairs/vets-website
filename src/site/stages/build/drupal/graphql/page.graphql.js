/**
 *
 */
module.exports = `
  fragment page on NodePage {
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
    fieldLastUpdate {
      value
      date
    }
  }
`;
