/**
 * A Drupal paragraph containing rich text.
 *
 */
module.exports = `
  fragment staffProfile on ParagraphStaffProfile {
    queryFieldStaffProfile {
      entities {
        ...on NodePersonProfile {
        entityUrl {
          path
        }
        fieldNameFirst
        fieldLastName
        fieldSuffix
        fieldDescription
        fieldEmailAddress
        fieldPhoneNumber

        fieldOffice {
          entity {
            entityLabel
            entityType
          }
        }

        fieldMedia {
          entity {
            ... on MediaImage {
              image {
                alt
                title
                url
                derivative(style: _1_1_SQUARE_MEDIUM_THUMBNAIL) {
                  url
                  width
                  height
                }
              }
            }
          }
        }

      }
    }
  }
}
`;
