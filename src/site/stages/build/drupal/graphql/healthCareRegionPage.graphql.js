/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
const healthCareRegionHealthServices = require('./facilities-fragments/healthCareRegionHealthServices.node.graphql');
const healthCareRegionNewsStories = require('./facilities-fragments/healthCareRegionNewsStories.node.graphql');
const healthCareRegionEvents = require('./facilities-fragments/healthCareRegionEvents.node.graphql');

module.exports = `
  fragment healthCareRegionPage on NodeHealthCareRegionPage {
    ${entityElementsFromPages}
    ${healthCareRegionNewsStories}
    ${healthCareRegionEvents}
    fieldNicknameForThisFacility
    title
    fieldMedia {
      entity {
        ... on MediaImage {
            image {
              alt
              title
              derivative(style: _72MEDIUMTHUMBNAIL) {
                  url
                  width
                  height
              }
            }
          }
      }
    }
    fieldGovdeliveryIdEmerg
    fieldGovdeliveryIdNews
    fieldIntroText
	  fieldRelatedLinks {
      entity {
      	... listOfLinkTeasers
      }
    }
    fieldOperatingStatus {
      url {
        path
      }
      title
    }
    reverseFieldRegionPageNode(limit: 100000, filter:{conditions:[{field: "type", value: "health_care_local_facility"}]}) {
      entities {
        ... on NodeHealthCareLocalFacility {
          title
          fieldOperatingStatusFacility
        }
      }
    }
    allPressReleaseTeasers: reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "press_release"}
        { field: "status", value: "1"}
      ]} sort: {field: "field_release_date", direction: DESC } limit: 100)
    {
      entities {
        ... on NodePressRelease {
          title
          entityUrl {
            path
          }
          fieldReleaseDate {
            value
          }
          fieldIntroText
        }
      }
    }
    ${healthCareLocalFacilities}
    fieldOtherVaLocations
    ${healthCareRegionHealthServices}
    eventTeasersAll: reverseFieldOfficeNode(limit: 1000, filter: {conditions: [{field: "type", value: "event_listing"}]}) {
      entities {
        ... on NodeEventListing {
          reverseFieldListingNode(sort: {field: "field_date", direction: ASC }, limit: 1, filter: {conditions: [{field: "type", value: "event"}, {field: "status", value: "1"}, { field: "field_date", value: [$today], operator: GREATER_THAN}]}) {
            entities {
              ... on NodeEvent {
                title
                uid {
                  targetId
                  ... on FieldNodeUid {
                    entity {
                      name
                      timezone
                    }
                  }
                }
                fieldDate {
                  startDate
                  value
                  endDate
                  endValue
                }
                fieldDescription
                fieldLocationHumanreadable
                fieldFacilityLocation {
                  entity {
                    title
                    entityUrl {
                      path
                    }
                  }
                }
              }
              entityUrl {
                path
              }
            }
          }
        }
      }
    }
    eventTeasersFeatured: reverseFieldOfficeNode(limit: 1000, filter: {conditions: [{field: "type", value: "event_listing"}]}) {
      entities {
        ... on NodeEventListing {
          reverseFieldListingNode(limit: 1000, filter: {conditions: [{field: "type", value: "event"}, {field: "status", value: "1"}, {field: "field_featured", value: "1"}, { field: "field_date", value: [$today], operator: GREATER_THAN}]}) {
            entities {
              ... on NodeEvent {
                title
                uid {
                  targetId
                  ... on FieldNodeUid {
                    entity {
                      name
                      timezone
                    }
                  }
                }
                fieldDate {
                  startDate
                  value
                  endDate
                  endValue
                }
                fieldDescription
                fieldLocationHumanreadable
                fieldFacilityLocation {
                  entity {
                    title
                    entityUrl {
                      path
                    }
                  }
                }
              }
              entityUrl {
                path
              }
            }
          }
        }
      }
    }
    newsStoryTeasersFeatured: reverseFieldOfficeNode(limit: 1000, filter: {conditions: [{field: "type", value: "story_listing"}]}) {
      entities {
        ... on NodeStoryListing {
          reverseFieldListingNode(limit: 1000, filter: {conditions: [{field: "type", value: "news_story"}, {field: "status", value: "1"}, {field: "field_featured", value: "1"}]}) {
            entities {
              ... on NodeNewsStory {
                title
                fieldFeatured
                fieldIntroText
                fieldMedia {
                  entity {
                    ... on MediaImage {
                      image {
                        alt
                        title
                        derivative(style: _32MEDIUMTHUMBNAIL) {
                          url
                          width
                          height
                        }
                      }
                    }
                  }
                }
                entityUrl {
                  path
                }
              }
            }
          }
        }
      }
    }
  }
`;
