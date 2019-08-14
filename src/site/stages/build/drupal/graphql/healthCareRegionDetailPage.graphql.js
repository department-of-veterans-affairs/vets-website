/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

const WYSIWYG = '... wysiwyg';
const STAFF = '... staffProfile';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const NUMBER_CALLOUT = '... numberCallout';
const TABLE = '... table';
const ALERT_PARAGRAPH = '... alertParagraph';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const MEDIA_PARAGRAPH = '... embeddedImage';
const entityElementsFromPages = require('./entityElementsForPages.graphql');

// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../utilities/featureFlags');

module.exports = `
  fragment healthCareRegionDetailPage on NodeHealthCareRegionDetailPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldIntroText
    ${
      enabledFeatureFlags[featureFlags.FEATURE_REGION_DETAIL_PAGE_TOC]
        ? 'fieldTableOfContentsBoolean'
        : ''
    }

    ${
      enabledFeatureFlags[
        featureFlags.FEATURE_REGION_DETAIL_PAGE_FEATURED_CONTENT
      ]
        ? `
          fieldFeaturedContent {
            entity {
              entityType
              entityBundle
              ${WYSIWYG}
              ${QA}
            }
          }
        `
        : ''
    }

    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${STAFF}
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}
        ${QA}
        ${LIST_OF_LINK_TEASERS}
        ${REACT_WIDGET}
        ${NUMBER_CALLOUT}
        ${TABLE}
        ${ALERT_PARAGRAPH}        
        ${
          enabledFeatureFlags[featureFlags.FEATURE_DOWNLOADABLE_FILE]
            ? `
                ${DOWNLOADABLE_FILE_PARAGRAPH}        
                ${MEDIA_PARAGRAPH}

              `
            : ''
        }        
      }
    }
    ${FIELD_RELATED_LINKS}

    ${
      enabledFeatureFlags[
        featureFlags.FEATURE_HEALTH_CARE_REGION_DETAIL_PAGE_FIELD_ALERT
      ]
        ? FIELD_ALERT
        : ''
    }
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
