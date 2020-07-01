/**
 * The 'List of link teasers' bundle of the 'Paragraph' entity type.
 */
const linkTeaser = require('./linkTeaser.paragraph.graphql');

const LINKTEASER_FRAGMENT = '...linkTeaser';
const LISTOFLINKTEASERS_FRAGMENT = '...listOfLinkTeasers';

const listOfLinkTeasers = `
  ${linkTeaser}
  fragment listOfLinkTeasers on ParagraphListOfLinkTeasers {
  	parentFieldName
    fieldTitle
    entityId
    fieldVaParagraphs {
      entity {
        ${LINKTEASER_FRAGMENT}
      }
    }
  }
`;

const FIELD_RELATED_LINKS = `
  fieldRelatedLinks {
      entity {
      	${LISTOFLINKTEASERS_FRAGMENT}
      }
    }
`;

module.exports = { listOfLinkTeasers, FIELD_RELATED_LINKS };
