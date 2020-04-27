/**
 * The 'Link to file or video' bundle of the 'Paragraph' entity type.
 *
 */
module.exports = `
  fragment downloadableFile on ParagraphDownloadableFile {
    entityId
    fieldTitle
    fieldMarkup
    fieldMedia {
      entity {
        entityBundle
        ... on MediaImage {
          image {
            url
            alt
            title
          }
        }
        ... on MediaVideo {
          fieldMediaVideoEmbedField
        }
        ... on MediaDocument {
          fieldDocument {
            entity {
              ... on File {
                filename
                url
              }
            }
          }
        }
      }
    }
  }
`;
