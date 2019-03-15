/**
 * The detail page containing static content for a health care region
 */

const {
  FIELD_RELATED_LINKS,
} = require('../paragraph-fragments/listOfLinkTeasers.paragraph.graphql');

const entityElementsFromPages = require('../entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const NUMBER_CALLOUT = '... numberCallout';

const DETAIL_PAGE_RESULTS = `
  entities {
    ... on NodeHealthCareRegionDetailPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
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
  }
`;

function queryFilter(isAll) {
  return `
    reverseFieldOfficeNode(
    filter: {
      conditions: [
        { field: "type", value: "health_care_region_detail_page"}
        { field: "status", value: "1"}
      ]
    } 
    sort: {field: "field_office", direction: DESC }
    limit:${isAll ? '500' : '10'})
  `;
}

module.exports = `
  allHealthcareDetailPages: ${queryFilter(true)}
    {
    ${DETAIL_PAGE_RESULTS}
  }
`;
