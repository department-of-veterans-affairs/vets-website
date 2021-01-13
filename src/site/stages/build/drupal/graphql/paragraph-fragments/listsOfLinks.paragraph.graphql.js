/**
 * The 'List of links' bundle of the 'Paragraph' entity type.
 */
module.exports = `
  fragment listsOfLinks on ParagraphListsOfLinks {
    entityId
    fieldSectionHeader
    fieldVaParagraphs {
      entity {
        entityBundle
        ... on ParagraphListOfLinks {
          fieldSectionHeader
          fieldLink {
            title
            url {
              path
            }
          }
          fieldLinks {
            title
            url {
              path
            }
          }
        }
      }
    }
  }
`;
