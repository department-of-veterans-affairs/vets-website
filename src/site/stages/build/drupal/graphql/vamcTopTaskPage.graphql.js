/**
 * A top level detail page.
 */

const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment vamcTopTaskPage on NodeVamcTopTaskPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldTableOfContentsBoolean
    fieldIntroTextTokenized {
      entity {
        ... on ParagraphReusableNationalTokenContent {
          fieldNationalContentTemplates {
            entity {
              ... on NodeVamcNationalContentEditable {
                title
                body {
                  value
                }
              }
            }
          }
        }
      }
    }
    fieldContentBlock {
      entity {
        ... on ParagraphReusableNationalContent {
          fieldContent {
            entity {
              ... on NodeVamcNationalContent {
                title
                body {
                  processed
                }
              }
            }
          }
          fieldNationalContentTemplates {
            entity {
              ... on NodeVamcNationalContentEditable {
                title
                body {
                  value
                }
              }
            }
          }
          fieldSystemLevelCustomConten {
            entity {
              ... on NodeVamcSystemContentCustom {
                title
                body {
                  processed
                }
              }
            }
          }
        }
      }
    }
    fieldFeaturedContent {
      entity {
        ... on ParagraphReusableNationalContent {
          fieldContent {
            entity {
              ... on NodeVamcNationalContent {
                title
                body {
                  processed
                }
              }
            }
          }
          fieldNationalContentTemplates {
            entity {
              ... on NodeVamcNationalContentEditable {
                title
                body {
                  value
                }
              }
            }
          }
          fieldSystemLevelCustomConten {
            entity {
              ... on NodeVamcSystemContentCustom {
                title
                body {
                  processed
                }
              }
            }
          }
        }
      }
    }
    ${FIELD_RELATED_LINKS}
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
