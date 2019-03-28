/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');

const WYSIWYG = '... wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const NUMBER_CALLOUT = '... numberCallout';
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment healthCareRegionDetailPage on NodeHealthCareRegionDetailPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldIntroText
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}
        ${QA}
        ${LIST_OF_LINK_TEASERS}
        ${REACT_WIDGET}
        ${NUMBER_CALLOUT}
      }
    }
    ${FIELD_RELATED_LINKS}
    fieldMedia {
      entity {
        entityId
        entityBundle
        name
        ...on MediaDocument {
          fieldDocument {
            entity {
              ...on File {
                filename
                url          
              }
            }
          }
        }   
        ...on MediaImage {        
          image {          
            alt
            url
          }
        }
        ...on MediaVideo {
          fieldMediaVideoEmbedField        
        }
      }
    }
  }
`;
