/**
 * A person profile detail page
 *
 */

module.exports = `
 fragment bioPage on NodePersonProfile {
    entityId
    entityBundle
    entityPublished
    changed
    title
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
  fieldNameFirst
  fieldLastName
  fieldSuffix
  fieldDescription
  fieldOffice {
    entity {
      entityLabel
      entityType
    }
  }
  fieldIntroText
  fieldPhotoAllowHiresDownload
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
  fieldBody {
    processed
  }
  changed
 }
`;
