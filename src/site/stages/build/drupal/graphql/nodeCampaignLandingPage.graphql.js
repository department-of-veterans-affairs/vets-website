const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
  fragment nodeCampaignLandingPage on NodeCampaignLandingPage {
    ${entityElementsFromPages}
    changed
    entityId
    title
    fieldAdministration {
      entity {
        ... on TaxonomyTermAdministration {
          fieldAcronym
          fieldDescription
          fieldEmailUpdatesLinkText
          fieldEmailUpdatesUrl
          fieldIntroText
          fieldLink {
            uri
            title
            options
          }
          fieldMetatags
          fieldSocialMediaLinks {
            platform
            value
            platformValues
          }
        }
      }
    }
    fieldBenefitCategories {
      entity {
        entityType
        entityBundle
        entityId
        ... on NodeLandingPage {
          fieldAdministration {
            entity {
              ... on TaxonomyTermAdministration {
                fieldAcronym
                fieldDescription
                fieldEmailUpdatesLinkText
                fieldEmailUpdatesUrl
                fieldIntroText
                fieldLink {
                  uri
                  title
                  options
                }
                fieldMetatags
                fieldSocialMediaLinks {
                  platform
                  value
                  platformValues
                }
              }
            }
          }
          fieldDescription
        }
      }
    }
    fieldClpAudience {
      entity {
        entityType
        entityBundle
        entityId
        ... on TaxonomyTermAudienceTags {
          name
        }
      }
    }
    fieldClpConnectWithUs {
      entity {
        entityType
        entityBundle
        entityId
        ... on TaxonomyTermAdministration {
          fieldAcronym
          fieldDescription
          fieldEmailUpdatesLinkText
          fieldEmailUpdatesUrl
          fieldIntroText
          fieldLink {
            uri
            title
            options
          }
          fieldMetatags
          fieldSocialMediaLinks {
            platform
            value
            platformValues
          }
        }
      }
    }
    fieldClpEventsHeader
    fieldClpEventsPanel
    fieldClpEventsReferences {
      entity {
        entityType
        entityBundle
        entityId
        ... on NodeEvent {
          fieldAdditionalInformationAbo {
            value
            format
            processed
          }
          fieldAddress {
            langcode
            countryCode
            administrativeArea
            locality
            dependentLocality
            postalCode
            sortingCode
            addressLine1
            addressLine2
            organization
            givenName
            additionalName
            familyName
          }
          fieldAdministration {
            entity {
              ... on TaxonomyTermAdministration {
                fieldAcronym
                fieldDescription
                fieldEmailUpdatesLinkText
                fieldEmailUpdatesUrl
                fieldIntroText
                fieldLink {
                  uri
                  title
                  options
                }
                fieldMetatags
                fieldSocialMediaLinks {
                  platform
                  value
                  platformValues
                }
              }
            }
          }
          fieldBody {
            value
            format
            processed
          }
          fieldDate {
            value
            startDate
            endValue
            endDate
          }
          fieldDatetimeRangeTimezone {
            value
            startTime
            endValue
            endTime
            duration
            rrule
            rruleIndex
            timezone
          }
          fieldDescription
          fieldEventCost
          fieldEventCta
          fieldEventRegistrationrequired
          fieldFacilityLocation {
            entity {
              entityType
              entityBundle
              entityId
            }
          }
          fieldFeatured
          fieldLink {
            uri
            title
            options
          }
          fieldListing {
            entity {
              entityType
              entityBundle
              entityId
              ... on NodeEventListing {
                fieldAdministration {
                  entity {
                    ... on TaxonomyTermAdministration {
                      fieldAcronym
                      fieldDescription
                      fieldEmailUpdatesLinkText
                      fieldEmailUpdatesUrl
                      fieldIntroText
                      fieldLink {
                        uri
                        title
                        options
                      }
                      fieldMetatags
                      fieldSocialMediaLinks {
                        platform
                        value
                        platformValues
                      }
                    }
                  }
                }
                fieldDescription
                fieldIntroText
                fieldMetaTitle
                fieldOffice {
                  entity {
                    entityType
                    entityBundle
                    entityId
                    ... on NodeOffice {
                      fieldAdministration {
                        entity {
                          entityType
                          entityBundle
                          entityId
                          ... on TaxonomyTermAdministration {
                            fieldAcronym
                            fieldDescription
                            fieldEmailUpdatesLinkText
                            fieldEmailUpdatesUrl
                            fieldIntroText
                            fieldLink {
                              uri
                              title
                              options
                            }
                            fieldMetatags
                            fieldSocialMediaLinks {
                              platform
                              value
                              platformValues
                            }
                          }
                        }
                      }
                      fieldBody {
                        value
                        format
                        processed
                      }
                      fieldDescription
                      fieldMetaTags
                      fieldMetaTitle
                    }
                  }
                }
              }
            }
          }
          fieldLocationHumanreadable
          fieldLocationType
          fieldMedia {
            entity {
              entityType
              entityBundle
              entityId
              ... on Media {
                thumbnail {
                  height
                  width
                  url
                  targetId
                  alt
                  title
                }
              }
            }
          }
          fieldMetaTags
          fieldOrder
          fieldUrlOfAnOnlineEvent {
            uri
            title
            options
          }
        }
      }
    }
    fieldClpFaqCta {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
    fieldClpFaqPanel
    fieldClpFaqParagraphs {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphQA {
          fieldAnswer {
            entity {
              entityType
              entityBundle
              entityId
              ... on ParagraphWysiwyg {
                fieldWysiwyg {
                  value
                  format
                  processed
                }
              }
            }
          }
          fieldQuestion
        }
      }
    }
    fieldClpResources {
      entity {
        entityType
        entityBundle
        entityId
        ... on MediaDocumentExternal {
          fieldDescription
          fieldMediaExternalFile {
            uri
            title
            options
          }
          fieldMediaInLibrary
          fieldMimeType
          fieldOwner {
            entity {
              entityType
              entityBundle
              entityId
              ... on TaxonomyTermAdministration {
                fieldAcronym
                fieldDescription
                fieldEmailUpdatesLinkText
                fieldEmailUpdatesUrl
                fieldIntroText
                fieldLink {
                  uri
                  title
                  options
                }
                fieldSocialMediaLinks {
                  platform
                  value
                  platformValues
                }
              }
            }
          }
        }
      }
    }
    fieldClpResourcesCta {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
    fieldClpResourcesHeader
    fieldClpResourcesIntroText
    fieldClpResourcesPanel
    fieldClpSpotlightCta {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
    fieldClpSpotlightHeader
    fieldClpSpotlightIntroText
    fieldClpSpotlightLinkTeasers {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphLinkTeaser {
          fieldLink {
            uri
            title
            options
          }
          fieldLinkSummary
        }
      }
    }
    fieldClpSpotlightPanel
    fieldClpStoriesCta {
      uri
      title
      options
    }
    fieldClpStoriesHeader
    fieldClpStoriesIntro
    fieldClpStoriesPanel
    fieldClpStoriesTeasers {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphLinkTeaserWithImage {
          fieldLinkTeaser {
            entity {
              ... on ParagraphLinkTeaser {
                fieldLink {
                  uri
                  title
                  options
                }
                fieldLinkSummary
              }
            }
          }
          fieldMedia {
            entity {
              ... on Media {
                name
                thumbnail {
                  height
                  width
                  url
                  targetId
                  alt
                  title
                }
              }
            }
          }
        }
      }
    }
    fieldClpVideoPanel
    fieldClpVideoPanelHeader
    fieldClpVideoPanelMoreVideo {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
    fieldClpWhatYouCanDoHeader
    fieldClpWhatYouCanDoIntro
    fieldClpWhatYouCanDoPromos {
      entity {
        entityType
        entityBundle
        entityId
        ... on BlockContentPromo {
          fieldImage {
            entity {
              ... on Media {
                name
                thumbnail {
                  height
                  width
                  url
                  targetId
                  alt
                  title
                }
              }
            }
          }
          fieldInstructions
          fieldOwner {
            entity {
              ... on TaxonomyTermAdministration {
                fieldAcronym
                fieldDescription
                fieldEmailUpdatesLinkText
                fieldEmailUpdatesUrl
                fieldIntroText
                fieldLink {
                  uri
                  title
                  options
                }
                fieldSocialMediaLinks {
                  platform
                  value
                  platformValues
                }
              }
            }
          }
          fieldPromoLink {
            entity {
              entityType
              entityBundle
              entityId
              ... on ParagraphLinkTeaser {
                fieldLink {
                  uri
                  title
                  options
                }
                fieldLinkSummary
              }
            }
          }
        }
      }
    }
    fieldClpWhyThisMatters
    fieldHeroBlurb
    fieldHeroImage {
      entity {
        entityType
        entityBundle
        entityId
        ... on MediaImage {
          image {
            height
            width
            url
            targetId
            alt
            title
          }
        }
      }
    }
    fieldMedia {
      entity {
        entityType
        entityBundle
        entityId
        ... on MediaVideo {
          name
          thumbnail {
            height
            width
            url
            targetId
            alt
            title
          }
        }
      }
    }
    fieldPrimaryCallToAction {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
    fieldSecondaryCallToAction {
      entity {
        entityType
        entityBundle
        entityId
        ... on ParagraphButton {
          fieldButtonLabel
          fieldButtonLink {
            uri
            title
            options
          }
        }
      }
    }
  }
`;
