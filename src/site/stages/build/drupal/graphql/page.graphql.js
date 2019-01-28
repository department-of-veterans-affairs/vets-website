const wysiwygParagraph = require('./paragraphs/wysiwyg.paragraph.graphql');
/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */
const WYSIWYG_FRAGMENT = '...wysiwyg';

module.exports = `
  ${wysiwygParagraph}

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
        ${WYSIWYG_FRAGMENT}
      }
    }
    changed
  }
`;
