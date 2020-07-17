/**
 * The 'Embedded image' bundle of the 'Paragraph' entity type.
 *
 */
module.exports = `
  fragment embeddedImage on ParagraphMedia {
    fieldAllowClicksOnThisImage
    fieldMedia {
      entity {
        entityId
        entityBundle
        ... on MediaImage {
          image {
            url
            alt
            title
          }
        }
      }
    }
  }
`;
