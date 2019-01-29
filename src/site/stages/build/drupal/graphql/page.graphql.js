const wysiwygParagraph = require('./paragraphs/wysiwyg.paragraph.graphql');
const listOfLinkTeasers = require('./paragraphs/listOfLinkTeasers.paragraph.graphql');
/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */
const WYSIWYG_FRAGMENT = '...wysiwyg';
const LISTOFLINKTEASERS_FRAGMENT = '...listOfLinkTeasers';

const RELATED_LINKS = `
  fieldRelatedLinks {
      entity {
      	${LISTOFLINKTEASERS_FRAGMENT}
      }
    }
`;

module.exports = `
  ${wysiwygParagraph}
  ${listOfLinkTeasers}

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
        ${LISTOFLINKTEASERS_FRAGMENT}
      }
    }
    changed
    ${RELATED_LINKS}
  }
`;
