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

        fieldBody {
          processed
        }

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
                derivative(style: _11SQUAREMEDIUMTHUMBNAIL) {
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

// Had to change "_11SQUAREMEDIUMTHUMBNAIL" to "_11SQUAREMEDIUMTHUMBNAIL"
