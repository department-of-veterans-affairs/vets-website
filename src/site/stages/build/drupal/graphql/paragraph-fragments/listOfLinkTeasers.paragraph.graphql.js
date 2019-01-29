const linkTeaser = require('./linkTeaser.paragraph.graphql');
/**
 * The 'List of link teasers' bundle of the 'Paragraph' entity type.
 */
const LINKTEASER_FRAGMENT = '...linkTeaser';

module.exports = `
  ${linkTeaser}
  
  fragment listOfLinkTeasers on ParagraphListOfLinkTeasers {
    fieldTitle
    fieldVaParagraphs {      
      entity {
        ${LINKTEASER_FRAGMENT}
      }    
    }
  }
`;
