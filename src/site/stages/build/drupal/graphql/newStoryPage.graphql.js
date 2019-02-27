/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

module.exports = `
  fragment newsStoryPage on NodeNewsStory {
    entityId
    entityBundle
    entityPublished
    promote
    created
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
    title
    fieldAuthor {    
      entity {
        ...on NodePersonProfile {
          title
          fieldDescription
        }
      }
    }
    fieldImageCaption
    fieldIntroText
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: CROP_2_1) {
              url
              width
              height
            }
          }
        }
      }
    }
    fieldFullStory {
      processed
    }
  }
`;
