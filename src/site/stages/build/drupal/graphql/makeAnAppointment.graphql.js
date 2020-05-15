/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

const WYSIWYG = '... wysiwyg';
const QA_SECTION = '... qaSection';
const REACT_WIDGET = '... reactWidget';
const ALERT_PARAGRAPH = '... alertParagraph';
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment makeAnAppointment on NodeMakeAnAppointment {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldNationalIntroText {
      entity {
        ... on BlockContentFacilityIntroText {
          body {
            processed
          }
        }
      }
    }
    fieldFeaturedContentBlocks {
      entity {
        ... on BlockContentFacilityContent {
          body {
            processed
          }
        }
      }
    }
    fieldMainContentBlocks {
      entity {
        ... on BlockContentFacilityContent {
          body {
            processed
          }
        }
      }
    }
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${WYSIWYG}
        ${QA_SECTION}
        ${REACT_WIDGET}
        ${ALERT_PARAGRAPH}
      }
    }
    ${FIELD_ALERT}
    fieldOffice {
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
          title
          fieldNicknameForThisFacility
        }
      }
    }
  }
`;
