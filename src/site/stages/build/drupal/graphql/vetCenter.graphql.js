const vetCenterFragment = `
 fragment vetCenterFragment on NodeVetCenter {
        entityId
        entityUrl {
          path
          routed
        }
        entityBundle
        entityLabel
        fieldIntroText
        fieldOfficeHours {
          day
          starthours
          endhours
          comment
        }
        # Other locations link:
        reverseFieldOfficeNode(limit: 500, filter:{conditions: [{field: "type", value: ["vet_center_locations_list"]}]}) {
          entities {
            ... on NodeVetCenterLocationsList {
              entityUrl {
                path
                routed
              }
            }
          }
        }        
        fieldPrepareForVisit {
          entity {
            ... on ParagraphBasicAccordion {
              fieldHeader
              fieldRichWysiwyg {
                processed
              }
            }
          }
        }        
        fieldHealthServices {
          entity {
            ... on NodeVetCenterFacilityHealthServi {
              fieldServiceNameAndDescripti {
                entity {
                  ... on TaxonomyTermHealthCareServiceTaxonomy {
                    name
                    fieldVetCenterTypeOfCare
                    fieldServiceTypeOfCare
                    fieldVetCenterFriendlyName
                    fieldAlsoKnownAs
                    fieldVetCenterComConditions
                    fieldCommonlyTreatedCondition
                    fieldVetCenterServiceDescrip
                    description {
                      processed
                    }
                  }
                }
              }
            }
          }
        }
      }`;

const GetVetCenters = `
  ${vetCenterFragment}
  
  query GetVetCenters {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },      
        { field: "type", value: ["vet_center"] }
      ]
    }) {
      entities {
        ... vetCenterFragment
      }
    }
  }
`;

module.exports = {
  fragment: vetCenterFragment,
  GetVetCenters,
};
